package com.auratherm.mobile.ui.alerts

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ProgressBar
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.auratherm.mobile.R
import com.auratherm.mobile.utils.AlertEventBus
import com.auratherm.mobile.utils.PrefManager
import com.auratherm.mobile.viewmodel.AlertsViewModel
import kotlinx.coroutines.launch

class AlertsFragment : Fragment() {

    private val viewModel: AlertsViewModel by viewModels()
    private lateinit var adapter: AlertAdapter

    // Зберігаємо токен на рівні класу, щоб він був доступний усім функціям
    private var token: String = ""

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.fragment_alerts, container, false)

        val rvAlerts = view.findViewById<RecyclerView>(R.id.rvAlerts)
        val pbAlerts = view.findViewById<ProgressBar>(R.id.pbAlerts)

        // Ініціалізуємо токен
        token = PrefManager.getToken(requireContext()) ?: ""

        rvAlerts.layoutManager = LinearLayoutManager(context)
        adapter = AlertAdapter(emptyList()) { alert ->
            val intent = Intent(requireContext(), AlertDetailActivity::class.java)
            intent.putExtra("ALERT_ID", alert.id) // Передаємо ID тривоги
            startActivity(intent)
        }
        rvAlerts.adapter = adapter

        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            pbAlerts.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

        viewModel.alertsList.observe(viewLifecycleOwner) { alerts ->
            adapter.updateData(alerts)
        }

        viewModel.errorMessage.observe(viewLifecycleOwner) { msg ->
            msg?.let { Toast.makeText(context, it, Toast.LENGTH_SHORT).show() }
        }

        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Слухаємо рупор (EventBus) для миттєвого оновлення списку при отриманні пуша
        viewLifecycleOwner.lifecycleScope.launch {
            AlertEventBus.events.collect {
                // Коли Firebase отримує пуш у фоні або foreground, він смикає цей код
                if (token.isNotEmpty()) {
                    viewModel.fetchAlerts(token)
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()
        // Цей метод спрацьовує при першому відкритті фрагмента
        // ТА щоразу, коли повертаємось на нього зі сторінки деталей
        if (token.isNotEmpty()) {
            viewModel.fetchAlerts(token)
        }
    }
}