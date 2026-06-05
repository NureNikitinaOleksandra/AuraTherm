package com.auratherm.mobile.ui.alerts

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.auratherm.mobile.R
import com.auratherm.mobile.model.Alert

class AlertAdapter(
    private var alerts: List<Alert>,
    private val onActionClick: (Alert) -> Unit
) : RecyclerView.Adapter<AlertAdapter.AlertViewHolder>() {

    class AlertViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvZoneName: TextView = view.findViewById(R.id.tvZoneName)
        val tvStatus: TextView = view.findViewById(R.id.tvStatus)
        val tvSensorName: TextView = view.findViewById(R.id.tvSensorName)
        val tvTime: TextView = view.findViewById(R.id.tvTime)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AlertViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_alert, parent, false)
        return AlertViewHolder(view)
    }

    override fun onBindViewHolder(holder: AlertViewHolder, position: Int) {
        val alert = alerts[position]

        holder.tvZoneName.text = alert.sensor.name
        holder.tvSensorName.text = "Зона: ${alert.sensor.zone.name}"
        holder.tvTime.text = "Час: ${alert.created_at.replace("T", " ").substring(0, 16)}"

        // Локалізація статусів та встановлення правильного кольору
        when (alert.status) {
            "NEW" -> {
                holder.tvStatus.text = "Нова"
                holder.tvStatus.setTextColor(Color.parseColor("#F44336")) // Червоний
            }
            "ACKNOWLEDGED" -> {
                holder.tvStatus.text = "В обробці"
                holder.tvStatus.setTextColor(Color.parseColor("#FF9800")) // Жовтий/Помаранчевий
            }
            "RESOLVED" -> {
                holder.tvStatus.text = "Вирішена"
                holder.tvStatus.setTextColor(Color.parseColor("#4CAF50")) // Зелений
            }
            else -> {
                holder.tvStatus.text = alert.status
                holder.tvStatus.setTextColor(Color.GRAY)
            }
        }

        // Клік по картці
        holder.itemView.setOnClickListener {
            onActionClick(alert)
        }
    }

    override fun getItemCount(): Int = alerts.size

    fun updateData(newAlerts: List<Alert>) {
        this.alerts = newAlerts
        notifyDataSetChanged()
    }
}