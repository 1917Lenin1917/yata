import { createContext } from "react";
import type { Project } from "@/types/project";

export const ProjectContext = createContext<Project | undefined>(undefined);
