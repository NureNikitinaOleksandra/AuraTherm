package com.auratherm.mobile.ui.zones

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.auratherm.mobile.R
import com.auratherm.mobile.model.Sensor

class ZoneSensorsAdapter(
    private var sensors: List<Sensor>
) : RecyclerView.Adapter<ZoneSensorsAdapter.SensorViewHolder>() {

    class SensorViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvName: TextView = view.findViewById(R.id.tvItemSensorName)
        val tvTemp: TextView = view.findViewById(R.id.tvItemSensorTemp)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SensorViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_zone_sensor, parent, false)
        return SensorViewHolder(view)
    }

    override fun onBindViewHolder(holder: SensorViewHolder, position: Int) {
        val sensor = sensors[position]
        holder.tvName.text = sensor.name

        // Використовуємо нашу змінну currentTemperature
        val temp = sensor.currentTemperature
        holder.tvTemp.text = if (temp != null) "$temp°C" else "Немає даних"
    }

    override fun getItemCount(): Int = sensors.size

    fun updateData(newSensors: List<Sensor>) {
        this.sensors = newSensors
        notifyDataSetChanged()
    }
}