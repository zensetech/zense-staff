import { useState } from "react"
import { useRouter } from "next/navigation"
import { setupRecaptcha, sendOTP as firebaseSendOTP, verifyOTP2 } from "@/lib/firebase/auth"
import { useAuth } from "@/context/AuthContext"
import toast from "react-hot-toast"

export const useFirebaseAuth = () => {
  const [loading, setLoading] = useState(false)
  const [verificationId, setVerificationId] = useState<string | null>(null)
  const router = useRouter()
  const { setIsNewUser } = useAuth()

  const sendOTP = async (phoneNumber: string) => {
    setLoading(true)
    try {
      const recaptchaVerifier = setupRecaptcha("recaptcha-container")
      const result = await firebaseSendOTP(phoneNumber, recaptchaVerifier)

      if (result.success && result.verificationId) {
        setVerificationId(result.verificationId)
        toast.success("OTP sent successfully!")
        return true
      } else {
        toast.error("Failed to send OTP. Please try again.")
        return false
      }
    } catch (error) {
      console.error("Error sending OTP:", error)
      toast.error("An error occurred. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async (otp: string) => {
    if (!verificationId) {
      toast.error("Verification ID not found. Please try again.")
      return false
    }

    setLoading(true)
    try {
      const result = await verifyOTP2(verificationId, otp, router)

      if (result.success) {
        toast.success("Phone verified successfully!")
        setIsNewUser(result.isNewUser ?? false)
        return true
      } else {
        toast.error("Invalid OTP. Please try again.")
        return false
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      toast.error("An error occurred. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    sendOTP,
    verifyOTP,
    loading,
  }
} 