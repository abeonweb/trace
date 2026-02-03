import { ResolutionRepository } from "../../application/ports/ResolutionRepository";
import { Resolution } from "../../domain/resolution/resolution";

export class FakeResolutionRepository implements ResolutionRepository {
    public saved: Resolution[] = [];

    async save(resolution: Resolution) {
        this.saved.push(resolution);
    }
}
