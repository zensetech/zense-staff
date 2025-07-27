"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, User, Calendar } from "lucide-react";
import { JobCard } from "@/components/dashboard/JobCard";
import { StatusFilter } from "@/components/dashboard/StatusFilter";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import { fetchJobs } from "@/lib/firebase/firestore";
import { Job } from "@/components/dashboard/JobCard";

import { addJobs } from "@/lib/firebase/postJobs";
import { Navigation } from "@/components/Navigation";
import LoadingScreen from "@/components/common/LoadingScreen";

// type Job = {
//   id: string;
//   status?: string;
//   patientName?: string;
//   age?: number;
//   description?: string;
//   requirements?: string[];
// };

// export default function Jobs() {
//   const { isAuthenticated, isLoading, userData } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isLoading) {
//       if (!isAuthenticated) {
//         router.push("/sign-in");
//       } else if (userData?.status !== "registered") {
//         router.push("/onboarding");
//       } else {
//         fetchJobs(userData?.status).then((result) => {
//           if (result.error) {
//             setError(result.error);
//           } else {
//             setJobs((result.jobs || []).map((job: { id: string; status?: string }) => ({ ...job, status: job.status || "unknown" })));
//           }
//         });
//       }
//     }
//   }, [isAuthenticated, isLoading, router, userData]);

export default function Jobs() {
  const { isAuthenticated, isLoading, userData, user } = useAuth();
  const [loading, setLoading] = useState(true);
  console.log("userData", userData);
  console.log("user", user?.uid);
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState("assigned");
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   console.log("add jobs useeffect mounted");
  //   addJobs();
  // }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/sign-in");
      } else if (userData?.status === "unregistered") {
        router.push("/onboarding");
      } else {
        fetchJobs(userData?.status || "unregistered", {
          uid: user?.uid || "",
        }).then((result) => {
          if (result.error) {
            setError(result.error);
          } else {
            console.log("result.jobs", result.jobs);
            setJobs(
              (result.jobs || []).map((job: any) => ({
                ...job,
                id: job.id.toString(), // Ensure id is treated as a string
              }))
            );
          }
        });
        setLoading(false);
      }
    }
  }, [isAuthenticated, isLoading, router, userData, user?.uid]);

  const filteredJobs =
    selectedStatus === "all"
      ? jobs
      : jobs.filter((job) => job.status === selectedStatus);

  const handleClockIn = () => {
    setClockInTime(new Date());
    setClockedIn(true);
  };

  const handleClockOut = () => {
    setClockedIn(false);
    // Here you would typically save the clock out time to your backend
  };

  if (loading || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 pl-3">Jobs</h1>

        
      </div>

      <StatusFilter
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {userData?.status === "live" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center py-12">
              <p className="text-lg text-gray-600">
                No {selectedStatus} jobs available at the moment.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
          <p className="text-lg text-gray-700 font-medium">
            Your approval is pending. You can view and apply to jobs once you
            are approved.
          </p>
        </div>
      )}
      <Navigation />
    </div>
  );
}
