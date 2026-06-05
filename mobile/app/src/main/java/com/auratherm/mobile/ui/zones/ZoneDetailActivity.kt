package com.auratherm.mobile.ui.zones

import android.os.Bundle
import android.view.View
import android.widget.ProgressBar
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.auratherm.mobile.R
import com.auratherm.mobile.utils.PrefManager
import com.auratherm.mobile.viewmodel.ZoneDetailViewModel

class ZoneDetailActivity : AppCompatActivity() {

    private val viewModel: ZoneDetailViewModel by viewModels()
    private lateinit var adapter: ZoneSensorsAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_zone_detail)

        val zoneId = intent.getStringExtra("ZONE_ID") ?: ""
        val zoneName = intent.getStringExtra("ZONE_NAME") ?: "Деталі зони"
        val token = PrefManager.getToken(this) ?: ""

        val toolbar = findViewById<Toolbar>(R.id.toolbarZoneDetail)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = zoneName
        toolbar.setNavigationOnClickListener { finish() }

        val rvSensors = findViewById<RecyclerView>(R.id.rvZoneSensors)
        val pbSensors = findViewById<ProgressBar>(R.id.pbZoneSensors)

        rvSensors.layoutManager = LinearLayoutManager(this)
        adapter = ZoneSensorsAdapter(emptyList())
        rvSensors.adapter = adapter

        viewModel.isLoading.observe(this) { isLoading ->
            pbSensors.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

        viewModel.sensorsList.observe(this) { sensors ->
            adapter.updateData(sensors)
        }

        viewModel.fetchSensorsForZone(token, zoneId)
    }
}