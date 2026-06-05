package com.auratherm.mobile.ui.zones

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ProgressBar
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.auratherm.mobile.R
import com.auratherm.mobile.utils.PrefManager
import com.auratherm.mobile.viewmodel.ZonesViewModel

class ZonesFragment : Fragment() {

    private val viewModel: ZonesViewModel by viewModels()
    private lateinit var zoneAdapter: ZoneAdapter

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.fragment_zones, container, false)

        val rvZones = view.findViewById<RecyclerView>(R.id.rvZones)
        val pbZones = view.findViewById<ProgressBar>(R.id.pbZones)
        val token = PrefManager.getToken(requireContext()) ?: ""

        rvZones.layoutManager = LinearLayoutManager(context)

        zoneAdapter = ZoneAdapter(emptyList()) { zone ->
            val intent = Intent(requireContext(), ZoneDetailActivity::class.java).apply {
                putExtra("ZONE_ID", zone.id)
                putExtra("ZONE_NAME", zone.name)
            }
            startActivity(intent)
        }
        rvZones.adapter = zoneAdapter

        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            pbZones.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

        viewModel.zonesList.observe(viewLifecycleOwner) { zones ->
            zoneAdapter.updateData(zones)
        }

        viewModel.fetchAssignedZones(token)
        return view
    }
}