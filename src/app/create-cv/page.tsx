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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex flex-1 bg-gray-100 overflow-hidden">
        {/* LEFT SIDE — scrollable form */}
        <section className="flex-1 p-8 overflow-y-auto h-screen">
          <div className="max-w-3xl mx-auto">
            <StepIndicator currentStep={step} />

            {step === 1 && <ProfileStep onNext={handleNext} />}
            {step === 2 && (
              <ExperienceStep onNext={handleNext} onPrev={handlePrev} />
            )}
            {step === 3 && (
              <EducationStep onNext={handleNext} onPrev={handlePrev} />
            )}
            {step === 4 && (
              <SkillStep onNext={handleNext} onPrev={handlePrev} />
            )}
          </div>
        </section>

        {/* RIGHT SIDE — sticky live preview */}
        <section className="hidden md:flex flex-1 justify-center items-start bg-gray-200 p-8">
          <div className="sticky top-8">
            <LivePreview />
          </div>
        </section>
      </main>
    </div>
  );
}
