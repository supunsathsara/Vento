import { Outlet } from "react-router-dom"
import eventParticipantsImage from '../assets/event-participants.jpg'; 

const AuthLayout = () => {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-screen">
      <div className="relative hidden lg:block bg-gradient-to-t from-[#180d3b]/90 to-[#180d3b]/70">
        <div className="absolute z-10 mt-24 mx-auto text-center w-full">
          <h1 className="text-7xl font-bold text-white mb-2">Vento</h1>
          <p className="text-gray-300 text-2xl">Real-time event ticketing platform</p>
        </div>
        
        <img
          src={eventParticipantsImage}
          alt="Auth background"
          className="h-full w-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      
      <div className="flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout