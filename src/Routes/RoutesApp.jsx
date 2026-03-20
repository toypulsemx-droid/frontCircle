import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home } from '../Pages/Home/Home'
import { MainLayout } from '../Layouts/MainLayout'
import { Emulator } from '../Pages/Emulator/Emulator'
import { Conciertos } from '../Pages/Conciertos/Conciertos'
import { Festivales } from '../Pages/Festivales/Festivales'
import { Deportes } from '../Pages/Deportes/Deportes'

import { EventoSingle } from '../Pages/EventoSingle/EventoSingle'
import { Check } from '../Pages/Check/Check'
import { Perfil } from '../Pages/AUTH/Perfil'
import { PrivateRoute } from '../Components/Auth/PrivateRoute'
import { EventsAll } from '../Pages/EventsAll/EventsAll'

export const RoutesApp = () => {
  return (
    <>
    <Routes>
        <Route path='/' element={<MainLayout><Home/></MainLayout>}/>
        <Route path='/conciertos' element={<MainLayout><Conciertos/></MainLayout>}/>
        <Route path='/festivales' element={<MainLayout><Festivales/></MainLayout>}/>
        <Route path='/deportes' element={<MainLayout><Deportes/></MainLayout>}/>
        <Route path='/:id/:slug' element={<MainLayout><EventoSingle/></MainLayout>}/>
        <Route path='/:id/:slug/all' element={<MainLayout><EventsAll/></MainLayout>}/>
        <Route path='/checkout/:id/:slug' element={<MainLayout><Check/></MainLayout>}/>
        <Route path='/perfil' element={<PrivateRoute><MainLayout><Perfil/></MainLayout></PrivateRoute>}/>
    </Routes>
    </>
  )
}
