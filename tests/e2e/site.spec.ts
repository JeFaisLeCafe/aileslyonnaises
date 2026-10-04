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
    "/bia/",
    "/flotte/",
    "/tarifs/",
    "/environnement/",
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

  await page.goto("/actualites/");
  await expect(page.locator(".page-hero--compact")).toBeVisible();
  await expect(page.locator(".page-hero__image")).toHaveCount(0);
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
  await expect(page.locator(".fleet-card img")).toHaveCount(6);
  await expect(
    page.locator(".fleet-card img[src^='https://cdn.sanity.io/']"),
  ).toHaveCount(6);
  await expect(
    page.locator("footer a[href='mailto:info2@aileslyonnaises.com']"),
  ).toHaveText("info2@aileslyonnaises.com");
  await expect(page.locator(".bia-card__logo")).toHaveAttribute(
    "src",
    "/images/brand/bia.webp",
  );
  await expect(
    page.locator(
      "script[src='https://static.cloudflareinsights.com/beacon.min.js']",
    ),
  ).toHaveAttribute(
    "data-cf-beacon",
    '{"token":"d9527efe77b644e5a501cc8369a0c26c"}',
  );

  const mainImages = page.locator("main img");
  for (const image of await mainImages.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(
        () =>
          image.evaluate(
            (element) =>
              element instanceof HTMLImageElement &&
              element.complete &&
              element.naturalWidth > 0,
          ),
        { timeout: 15_000 },
      )
      .toBe(true);
  }

  const fleetImageSources = await page
    .locator(".fleet-card img")
    .evaluateAll((images) => images.map((image) => image.getAttribute("src")));
  expect(new Set(fleetImageSources).size).toBe(fleetImageSources.length);
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
    page.getByRole("link", { name: /Qualification au vol de nuit/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: /Sensibilisation au vol en région montagneuse/,
    }),
  ).toBeVisible();

  await page.goto("/apprendre/ppl/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "PPL(A) — Licence de pilote privé",
    }),
  ).toBeVisible();
  await expect(page.getByText("45 h", { exact: true })).toBeVisible();
});

test("contact form exposes required qualification fields", async ({ page }) => {
  await page.goto("/contact/#formation");

  await expect(page.getByLabel("Nom et prénom *")).toBeVisible();
  await expect(page.getByLabel("Votre projet *")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Envoyer ma demande" }),
  ).toBeVisible();
});

test("pricing renders CMS rates", async ({ page }) => {
  await page.goto("/tarifs/");

  const bristellRate = page.getByRole("row", { name: /F-HSMB/ });
  await expect(bristellRate).toBeVisible();
  await expect(bristellRate.getByRole("cell")).toHaveCount(4);
  await expect(bristellRate).toContainText("€");
});

test("fleet renders Sanity aircraft details", async ({ page }) => {
  await page.goto("/flotte/");

  await expect(page.getByText("Glass cockpit", { exact: true })).toBeVisible();
  await expect(
    page.locator(".aircraft img[src^='https://cdn.sanity.io/']"),
  ).toHaveCount(6);
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

test("environment and news appear in site navigation", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#main-navigation a[href='/']")).toContainText(
    "Accueil",
  );
  await expect(
    page.locator("#main-navigation a[href='/environnement/']"),
  ).toHaveCount(1);
  await expect(
    page.locator("footer").getByRole("link", { name: "Actualités" }),
  ).toHaveAttribute("href", "/actualites/");
  await expect(
    page.getByRole("link", { name: "Toutes les actualités" }),
  ).toHaveAttribute("href", "/actualites/");

  await page.goto("/environnement/");
  await expect(
    page.getByRole("heading", { name: /Voler en tenant compte/ }),
  ).toBeVisible();
  await expect(page.locator("#charte")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Voir la flotte concernée" }),
  ).toHaveCount(0);

  await page.goto("/actualites/");
  const latestNews = page.locator(".news-card").first();
  await expect(latestNews).toBeVisible();
  await latestNews.click();
  await expect(page).toHaveURL(/\/actualites\/[^/]+\/$/);
  await expect(page.locator(".news-gallery img").first()).toHaveCSS(
    "object-fit",
    "contain",
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("instructor cards use the compact governance layout", async ({ page }) => {
  await page.goto("/apprendre/");

  expect(
    await page.locator(".instructor-grid .person-card").count(),
  ).toBeGreaterThan(0);
  await expect(
    page.locator(".instructor-grid .person-card__image").first(),
  ).toHaveCSS("height", "96px");
});

test("external links open in a new tab", async ({ page }) => {
  await page.goto("/bia/");
  const external = page.locator("a[rel~='external']").first();
  await expect(external).toHaveAttribute("target", "_blank");
});

test("club life splits bureau and board when CMS members exist", async ({
  page,
}) => {
  await page.goto("/vie-du-club/");

  await expect(page.locator(".eyebrow", { hasText: "Bureau" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Gilles PELLENZ" }).first(),
  ).toBeVisible();
  await expect(
    page.locator(".eyebrow", { hasText: "Conseil d’administration" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Fabien COCHARD" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Marie Marvingt/ }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Voir toutes les actualités" }),
  ).toHaveAttribute("href", "/actualites/");

  const story = page.locator(".story-grid .media-card").first();
  await expect(story).toHaveAttribute("href", "/vie-du-club/histoire-du-club/");
  await story.click();
  await expect(
    page.getByRole("heading", {
      name: "Un club ancré dans le territoire lyonnais",
      level: 1,
    }),
  ).toBeVisible();
});

test("partner marks load correctly", async ({ page }) => {
  await page.goto("/vie-du-club/");

  const marks = page.locator(".partner-list img");
  await expect(marks).toHaveCount(4);
  for (const mark of await marks.all()) {
    await mark.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        mark.evaluate((image) =>
          image instanceof HTMLImageElement ? image.naturalWidth : 0,
        ),
      )
      .toBeGreaterThan(0);
  }
});

test("main routes have no automatically detectable accessibility violations", async ({
  page,
}) => {
  const routes = [
    "/",
    "/apprendre/",
    "/environnement/",
    "/vie-du-club/",
    "/actualites/",
    "/contact/",
  ];

  for (const route of routes) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, route).toEqual([]);
  }
});
