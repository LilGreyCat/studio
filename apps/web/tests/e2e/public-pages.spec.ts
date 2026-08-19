import { expect, test } from "@playwright/test";

test("the shop placeholder is available", async ({ page }) => {
    await page.goto("/shop");

    await expect(page).toHaveTitle(/Shop/);
    await expect(
        page.getByRole("heading", { name: "Le Shop arrive bientôt" })
    ).toBeVisible();
    await expect(
        page.getByAltText("Aperçu de la future collection Nhadès Records")
    ).toBeVisible();
});

test("an unauthenticated visitor sees the admin login", async ({ page }) => {
    await page.route("**/admin/me", async (route) => {
        await route.fulfill({ status: 401, body: "Unauthorized" });
    });

    await page.goto("/admin");

    await expect(
        page.getByRole("heading", { name: "Login Administrateur" })
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Mot de passe")).toBeVisible();
    await expect(
        page.getByRole("button", { name: "Se connecter" })
    ).toBeVisible();
});
