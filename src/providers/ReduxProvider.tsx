"use client"
import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import { setCustomerSession, setAdmin } from '@/redux/slices/authSlice'
import { setItems } from '@/redux/slices/cartSlice'

function loadCustomerSession() {
  try {
    const raw = localStorage.getItem('auth_session')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function loadAdminSession() {
  try {
    const raw = localStorage.getItem('auth_admin')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function loadCartItems() {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]')
  } catch {
    return []
  }
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(setCustomerSession(loadCustomerSession()))
    store.dispatch(setAdmin(loadAdminSession()))
    store.dispatch(setItems(loadCartItems()))
  }, [])

  return <Provider store={store}>{children}</Provider>
}
