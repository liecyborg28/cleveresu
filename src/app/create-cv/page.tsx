"use client";
import { useState } from "react";
import ProfileStep from "./components/forms/ProfileStep";
import ExperienceStep from "./components/forms/ExperienceStep";
import EducationStep from "./components/forms/EducationStep";
import SkillStep from "./components/forms/SkillStep";
import StepIndicator from "./components/StepIndicator";
import LivePreview from "../live-preview/page";
import Navbar from "@/components/Navbar";

export default function CreateCvPage() {
  const [step, setStep] = useState(1);
  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);
  // const handleSave = () => 

  return (
    <div >
     <Navbar/>
    <main className="flex min-h-screen bg-gray-100">
      <section className="flex-1 p-8 overflow-y-auto">
        <StepIndicator currentStep={step} />
        {step === 1 && <ProfileStep onNext={handleNext} />}
        {step === 2 && <ExperienceStep onNext={handleNext} onPrev={handlePrev} />}
        {step === 3 && <EducationStep onNext={handleNext} onPrev={handlePrev} />}
        {step === 4 && <SkillStep onNext={handleNext} onPrev={handlePrev} />}
      </section>

      <section className="hidden md:flex flex-1 justify-center items-center bg-gray-200">
        <LivePreview />
      </section>
    </main>
    </div>
  );
}
