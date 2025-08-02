"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { X, Phone, ArrowRight } from "lucide-react"
import { useFirebaseAuth } from "@/hooks/use-firebase-auth"
import { useAuth } from "@/context/AuthContext"
import LoadingScreen from "@/components/common/LoadingScreen"
import { IN } from "country-flag-icons/react/3x2"

export default function SignIn() {
  const { isLoading } = useAuth()
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const { sendOTP, verifyOTP, loading } = useFirebaseAuth()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Prevent body scrolling (works better on iOS with additional styles)
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.inset = "0"
    document.body.style.width = "100%"
    document.body.style.height = "100%"

    return () => {
      // Restore body scroll on unmount
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.inset = ""
      document.body.style.width = ""
      document.body.style.height = ""
    }
  }, [])

  useEffect(() => {
    // Auto-focus input on mobile to trigger numeric keypad
    if (step === "phone" && inputRef.current) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [step])

  const handleSendOTP = async () => {
    const success = await sendOTP(`+91${phoneNumber}`)
    if (success) setStep("otp")
  }

  const handleVerifyOTP = async () => {
    const success = await verifyOTP(otp)
    if (success) {
      console.log("Authentication successful!")
      // The RouteGuard will handle the redirect based on user status
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <main
      className={`
        fixed top-0 left-0 w-screen h-screen overflow-hidden bg-white
        flex flex-col items-center justify-center
        md:hidden   /* Hide on tablet/desktop */
      `}
    >
      <div className="h-full bg-white flex flex-col w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="/icons/icon-512.png" 
              alt="Zense Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          
        </div>

        {step === "phone" ? (
          <>
            {/* Content */}
            <div className="flex-1 px-6 py-8">
              <h1 className="text-4xl font-bold text-black mb-12 leading-tight">What's your phone number?</h1>

              <div className="space-y-6">
                {/* Phone Input */}
                <div className="space-y-4">
                  <div className="flex items-end space-x-3">
                    <div className="flex items-center space-x-2 pb-3 mr-2">
                      <IN className="w-6 h-4 rounded-sm" />
                      <span className="text-2xl font-medium">+91</span>
                      {/* <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg> */}
                    </div>
                    <div className="flex-1 pb-3">
                      <Input
                        ref={inputRef}
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="border-0 text-2xl font-normal p-0 focus:ring-0 bg-transparent placeholder:text-gray-300"
                        placeholder="9876543210"
                        autoFocus
                      />
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <p className="text-gray-500 text-sm leading-relaxed">
                  Zense will send you a text with a verification code. Message and data rates may apply.
                </p>

                <div className="flex justify-end">
                  <Button 
                    variant="ghost" 
                    className="flex items-center justify-center p-0 h-auto"
                    onClick={phoneNumber.length === 10 ? handleSendOTP : undefined}
                    disabled={phoneNumber.length !== 10 || loading}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      phoneNumber.length === 10 && !loading 
                        ? 'bg-black text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </Button>
                </div>
              </div>
            </div>


          </>
        ) : (
          /* OTP Screen */
          <div className="flex-1 px-6 py-8">
            <h1 className="text-4xl font-bold text-black mb-8 leading-tight">Enter verification code</h1>

            <p className="text-gray-500 text-lg mb-8">
              We sent a 6-digit code to
              <br />
              <span className="font-medium text-black">+91 {phoneNumber}</span>
            </p>

            <div className="flex justify-center mb-8">
              <InputOTP maxLength={6} value={otp} onChange={setOtp} className="gap-3">
                <InputOTPGroup>
                  <InputOTPSlot
                    index={0}
                    className="w-12 h-16 text-2xl border-2 border-gray-200 focus:border-black rounded-xl"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-12 h-16 text-2xl border-2 border-gray-200 focus:border-black rounded-xl"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-12 h-16 text-2xl border-2 border-gray-200 focus:border-black rounded-xl"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-12 h-16 text-2xl border-2 border-gray-200 focus:border-black rounded-xl"
                  />
                  <InputOTPSlot
                    index={4}
                    className="w-12 h-16 text-2xl border-2 border-gray-200 focus:border-black rounded-xl"
                  />
                  <InputOTPSlot
                    index={5}
                    className="w-12 h-16 text-2xl border-2 border-gray-200 focus:border-black rounded-xl"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {otp.length === 6 && (
              <Button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full h-14 bg-black text-white rounded-xl font-medium text-lg mb-4"
              >
                {loading ? "Verifying..." : "Verify"}
              </Button>
            )}

            <Button variant="ghost" onClick={handleSendOTP} className="w-full text-purple-600 hover:text-purple-700">
              Resend code
            </Button>
          </div>
        )}

        {/* Hidden recaptcha container for Firebase */}
        <div id="recaptcha-container" className="hidden" />
      </div>
    </main>
  )
}
