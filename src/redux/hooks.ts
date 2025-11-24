/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store";
import {
  setProfile,
  addExperience,
  removeExperience,
  setExperiences,
  addEducation,
  removeEducation,
  setEducations,
  addSkill,
  removeSkill,
  setSkills,
  resetCvData,
} from "./cvDataSlice";

export const useCvData = () => {
  const dispatch: AppDispatch = useDispatch();
  const cvData = useSelector((state: RootState) => state.cvData);

  return {
    ...cvData,
    setProfile: (data: any) => dispatch(setProfile(data)),
    addExperience: (data: any) => dispatch(addExperience(data)),
    removeExperience: (id: string) => dispatch(removeExperience(id)),
    setExperiences: (data: any) => dispatch(setExperiences(data)),

    addEducation: (data: any) => dispatch(addEducation(data)),
    removeEducation: (id: string) => dispatch(removeEducation(id)),
    setEducations: (data: any) => dispatch(setEducations(data)),

    addSkill: (data: any) => dispatch(addSkill(data)),
    removeSkill: (id: string) => dispatch(removeSkill(id)),
    setSkills: (data: any) => dispatch(setSkills(data)),

    resetCvData: () => dispatch(resetCvData()),
  };
};
