import { Resolution } from "@/domain/resolution/resolution";

export interface ResolutionRepository {
    save(resolution: Resolution): Promise<void>
}