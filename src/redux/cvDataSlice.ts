import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Profile = {
  full_name?: string;
  photo_profile?: string;
  gender?: string;
  desc?: string;
  address?: string;
  birthdate?: string;
  email?: string;
};

type Experience = {
  id?: string;
  start_at: string;
  end_at?: string;
  place: string;
  position: string;
  desc?: string;
  certificate?: string;
};

type Education = {
  id?: string;
  start_at: string;
  end_at?: string;
  place: string;
  desc?: string;
  type: string;
  certificate?: string;
};

type Skill = {
  id?: string;
  name: string;
  desc?: string;
  type: string;
};

type CvState = {
  profile: Profile;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
};

const initialState: CvState = {
  profile: {
    full_name: "",
    photo_profile: "",
    gender: "",
    desc: "",
    address: "",
    birthdate: "",
    email: "",
  },
  experiences: [],
  educations: [],
  skills: [],
};

const cvDataSlice = createSlice({
  name: "cvData",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Partial<Profile>>) {
      state.profile = { ...state.profile, ...action.payload };
    },
    addExperience(state, action: PayloadAction<Experience>) {
      state.experiences.push(action.payload);
    },
    removeExperience(state, action: PayloadAction<string>) {
      state.experiences = state.experiences.filter(
        (e) => e.id !== action.payload
      );
    },
    setExperiences(state, action: PayloadAction<Experience[]>) {
      state.experiences = action.payload;
    },
    addEducation(state, action: PayloadAction<Education>) {
      state.educations.push(action.payload);
    },
    removeEducation(state, action: PayloadAction<string>) {
      state.educations = state.educations.filter(
        (e) => e.id !== action.payload
      );
    },
    setEducations(state, action: PayloadAction<Education[]>) {
      state.educations = action.payload;
    },
    addSkill(state, action: PayloadAction<Skill>) {
      state.skills.push(action.payload);
    },
    removeSkill(state, action: PayloadAction<string>) {
      state.skills = state.skills.filter((s) => s.id !== action.payload);
    },
    setSkills(state, action: PayloadAction<Skill[]>) {
      state.skills = action.payload;
    },
    resetCvData() {
      return initialState;
    },
  },
});

export const {
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
} = cvDataSlice.actions;

export default cvDataSlice.reducer;
