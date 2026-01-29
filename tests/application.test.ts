import { describe, expect, it, vi } from "vitest";
import { IssueRepository } from "../application/issue/issueRepository";
import { resolveIssueUseCase } from "../application/issue/resolveIssueUseCase";
import { Issue } from "@/domain/issue/issue";
import { Resolution } from "@/domain/resolution/resolution";

describe("Application layer", () => {
  const fakeRepo: IssueRepository = {
    async getById(id) {
      return {
        id,
        title: "The faker",
        description: "It's a fake",
        status: "open",
      };
    },

    async save(issue) {
      console.log(issue.title);
    },
    async saveResolution(resolution) {
      console.log(resolution.prevention);
    },
  };
  const resolution = {
    issueId: "2",
    rootCause: "A bad case of the frontend jitters",
    prevention: "Drink less coffee",
  };
  it("Marks an issue resolved correctly", async () => {
    const result = await resolveIssueUseCase("2", resolution, fakeRepo);
    expect(result.status).toBe("resolved");
  });

  const getSaveSpy = vi.spyOn(fakeRepo, "save");
  const issue: Issue = {
    id: "3",
    title: "Image not optimized",
    description: "images all have a large size",
    status: "resolved",
  };

  it("Saves a resolved issue", () => {
    fakeRepo.save(issue);
    expect(getSaveSpy).toHaveBeenCalled();
  });

  const getSaveResolutionSpy = vi.spyOn(fakeRepo, "saveResolution");
  it("Saves Resolution", () => {
    fakeRepo.saveResolution(resolution);
    expect(getSaveResolutionSpy).toHaveBeenCalled();
  });
});

describe("Failing tests", () => {
  const fakeRepo: IssueRepository = {
    async getById() {
      return null;
    },
    async save(issue) {
      console.log(issue);
    },
    async saveResolution(resolution) {
      console.log(resolution);
    },
  };
  it("Issue does not exist", async () => {
    const fakeIssue: Issue = {
      id:"fake-id",
      title: "Fake title",
      description:"Fake description of fake issue",
      status: "open"
    }
    const fakeResolution: Resolution = {
      issueId: "",
      rootCause:"",
      prevention:""
    }
    const resolved = resolveIssueUseCase(fakeIssue.id, fakeResolution, fakeRepo)
    await expect(resolved).rejects.toThrow("Issue not found")
  });
});
