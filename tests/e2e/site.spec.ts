import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("homepage presents the primary training journey", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Bienvenue à l’Aéroclub Les Ailes Lyonnaises/,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Apprendre à piloter" }).first(),
  ).toHaveAttribute("href", "/apprendre/");
});

test("internal navigation avoids full-page reloads and initializes scripts", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    const testWindow = window as Window & {
      __conversionEvents?: string[];
      __navigationProbe?: string;
    };
    testWindow.__navigationProbe = "preserved";
    testWindow.__conversionEvents = [];
    window.addEventListener("conversion", (event) => {
      const detail = (event as CustomEvent<{ name?: string }>).detail;
      if (detail.name) testWindow.__conversionEvents?.push(detail.name);
    });
  });

  await page.getByRole("link", { name: "Apprendre à piloter" }).first().click();
  await expect(page).toHaveURL(/\/apprendre\/$/);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as Window & { __navigationProbe?: string }).__navigationProbe,
      ),
    )
    .toBe("preserved");

  await page.evaluate(() => {
    document
      .querySelector<HTMLAnchorElement>('a[href="/contact/#formation"]')
      ?.click();
  });
  await expect(page).toHaveURL(/\/contact\/#formation$/);

  await page.getByLabel("Nom et prénom *").fill("Test navigation");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as Window & { __conversionEvents?: string[] })
            .__conversionEvents,
      ),
    )
    .toContain("training_form_start");
});

test("navbar pages use consistent, readable image heroes", async ({ page }) => {
  const routes = [
    "/decouvrir/",
    "/apprendre/",
    "/flotte/",
    "/tarifs/",
    "/vie-du-club/",
    "/contact/",
  ];
  const heroHeights: number[] = [];

  for (const route of routes) {
    await page.goto(route);
    const hero = page.locator(".page-hero");
    const image = hero.locator(".page-hero__image");

    await expect(image).toHaveCount(1);
    await expect
      .poll(() =>
        image.evaluate(
          (element) =>
            element instanceof HTMLImageElement &&
            element.complete &&
            element.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await expect(hero.locator(".page-hero__eyebrow")).toHaveCSS(
      "color",
      "rgb(255, 233, 91)",
    );
    await expect(hero.locator(".page-hero__introduction")).toHaveCSS(
      "color",
      "rgba(255, 255, 255, 0.9)",
    );

    const secondaryButton = hero.locator(".button--ghost");
    if ((await secondaryButton.count()) > 0) {
      await expect(secondaryButton).toHaveCSS("color", "rgb(255, 255, 255)");
    }

    const box = await hero.boundingBox();
    expect(box).not.toBeNull();
    heroHeights.push(box?.height ?? 0);

    const viewportFit = await page.evaluate(() => {
      const header = document.querySelector<HTMLElement>(".site-header");
      const pageHero = document.querySelector<HTMLElement>(".page-hero");
      return Math.abs(
        (header?.getBoundingClientRect().height ?? 0) +
          (pageHero?.getBoundingClientRect().height ?? 0) -
          window.innerHeight,
      );
    });
    expect(viewportFit).toBeLessThanOrEqual(2);
  }

  expect(
    Math.max(...heroHeights) - Math.min(...heroHeights),
  ).toBeLessThanOrEqual(1);
});

test("homepage visual essentials remain legible and complete", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");

  const heroTitle = page.locator(".home-hero h1");
  await expect(heroTitle).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(page.locator(".site-header")).toHaveCSS("position", "sticky");
  await expect(page.locator(".utility")).toHaveCount(0);
  await expect(page.locator("footer")).toContainText("Aéroport de Lyon-Bron");
  const viewportFit = await page.evaluate(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    const hero = document.querySelector<HTMLElement>(".home-hero");
    return Math.abs(
      (header?.getBoundingClientRect().height ?? 0) +
        (hero?.getBoundingClientRect().height ?? 0) -
        window.innerHeight,
    );
  });
  expect(viewportFit).toBeLessThanOrEqual(2);
  await expect(page.locator(".home-hero .button-row")).toHaveCSS(
    "justify-content",
    "center",
  );
  if (isMobile) {
    await expect(page.locator(".menu-button")).toBeVisible();
    await expect(page.locator(".main-navigation")).toHaveCSS("display", "none");
  } else {
    await expect(page.locator(".menu-button")).toBeHidden();
    await expect(page.locator(".main-navigation")).toHaveCSS("display", "flex");
  }
  await expect(page.locator(".fleet-card img")).toHaveCount(3);

  const mainImages = page.locator("main img");
  for (const image of await mainImages.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (element) =>
            element instanceof HTMLImageElement &&
            element.complete &&
            element.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }

  const imageSources = await mainImages.evaluateAll((images) =>
    images.map((image) => image.getAttribute("src")),
  );
  expect(new Set(imageSources).size).toBe(imageSources.length);
});

test("training page links to each active course", async ({ page }) => {
  await page.goto("/apprendre/");

  await expect(
    page.getByRole("link", { name: /Licence de pilote privé/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Licence de pilote d’avion léger/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Qualification vol de nuit/ }),
  ).toBeVisible();
});

test("contact form exposes required qualification fields", async ({ page }) => {
  await page.goto("/contact/#formation");

  await expect(page.getByLabel("Nom et prénom *")).toBeVisible();
  await expect(page.getByLabel("Votre projet *")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Envoyer ma demande" }),
  ).toBeVisible();
});

test("pricing renders CMS fallback rates", async ({ page }) => {
  await page.goto("/tarifs/");

  await expect(page.getByRole("cell", { name: "F-HSMB" })).toBeVisible();
  await expect(
    page.getByRole("cell", { name: /179,40/ }).first(),
  ).toBeVisible();
});

test("mobile navigation opens and remains keyboard accessible", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile navigation only");
  await page.goto("/");

  const menu = page.getByRole("button", { name: "Ouvrir le menu" });
  await menu.focus();
  await page.keyboard.press("Enter");

  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("link", { name: "Découvrir", exact: true }),
  ).toBeVisible();
});

test("homepage has no automatically detectable accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
