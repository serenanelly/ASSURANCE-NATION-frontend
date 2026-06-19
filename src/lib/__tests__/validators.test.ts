import { describe, it, expect } from "vitest";
import {
  loginSchema,
  changePasswordSchema,
  registerSchema,
  prescriptionCreateSchema,
} from "../validators";
import { PrescriptionType, UserType } from "@/types/enums";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  const validPassword = "Password1!";

  it("accepts valid change password data", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "OldPass1!",
      newPassword: validPassword,
      confirmPassword: validPassword,
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched confirmation", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "OldPass1!",
      newPassword: validPassword,
      confirmPassword: "Different1!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("confirmPassword");
    }
  });

  it("rejects weak new password", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "OldPass1!",
      newPassword: "weak",
      confirmPassword: "weak",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse({
      email: "medecin@example.com",
      password: "Password1!",
      confirmPassword: "Password1!",
      nom: "Dupont",
      prenom: "Jean",
      userType: UserType.MEDECIN,
    });
    expect(result.success).toBe(true);
  });

  it("rejects password mismatch", () => {
    const result = registerSchema.safeParse({
      email: "medecin@example.com",
      password: "Password1!",
      confirmPassword: "Password2!",
      nom: "Dupont",
      prenom: "Jean",
      userType: UserType.MEDECIN,
    });
    expect(result.success).toBe(false);
  });
});

describe("prescriptionCreateSchema", () => {
  it("requires medicament and duree for MEDICAMENT type", () => {
    const result = prescriptionCreateSchema.safeParse({
      type: PrescriptionType.MEDICAMENT,
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid medicament prescription", () => {
    const result = prescriptionCreateSchema.safeParse({
      type: PrescriptionType.MEDICAMENT,
      medicament: "Paracétamol",
      duree: 7,
    });
    expect(result.success).toBe(true);
  });

  it("requires motif for CONSULTATION type", () => {
    const result = prescriptionCreateSchema.safeParse({
      type: PrescriptionType.CONSULTATION,
    });
    expect(result.success).toBe(false);
  });

  it("rejects duree outside 1-365 range", () => {
    const result = prescriptionCreateSchema.safeParse({
      type: PrescriptionType.MEDICAMENT,
      medicament: "Paracétamol",
      duree: 400,
    });
    expect(result.success).toBe(false);
  });
});
