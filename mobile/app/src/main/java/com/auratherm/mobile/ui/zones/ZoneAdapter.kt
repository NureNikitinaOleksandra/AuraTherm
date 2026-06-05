package com.auratherm.mobile.ui.zones

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.auratherm.mobile.R
import com.auratherm.mobile.model.MobileZone

class ZoneAdapter(
    private var zones: List<MobileZone>,
    private val onZoneClick: (MobileZone) -> Unit
) : RecyclerView.Adapter<ZoneAdapter.ZoneViewHolder>() {

    class ZoneViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvZoneName: TextView = view.findViewById(R.id.tvZoneName)
        val tvZoneLimits: TextView = view.findViewById(R.id.tvZoneLimits)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ZoneViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_zone, parent, false)
        return ZoneViewHolder(view)
    }

    override fun onBindViewHolder(holder: ZoneViewHolder, position: Int) {
        val zone = zones[position]
        holder.tvZoneName.text = zone.name
        holder.tvZoneLimits.text = "Режим: від ${zone.min_temp}°C до ${zone.max_temp}°C"

        holder.itemView.setOnClickListener { onZoneClick(zone) }
    }

    override fun getItemCount(): Int = zones.size

    fun updateData(newZones: List<MobileZone>) {
        this.zones = newZones
        notifyDataSetChanged()
    }
}