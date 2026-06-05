package com.auratherm.mobile.utils

import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow

object AlertEventBus {
    // SharedFlow - ідеальний інструмент для трансляції подій
    private val _events = MutableSharedFlow<Unit>()
    val events = _events.asSharedFlow()

    suspend fun emitAlertEvent() {
        _events.emit(Unit)
    }
}