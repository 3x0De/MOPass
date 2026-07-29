<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from "vue-router";
import { RiAddFill } from "@remixicon/vue";

const router = useRouter();

const addPage = async () => {
  try {
    const resp = await fetch("/comptes.csv");
    if (!resp.ok) throw new Error("Impossible de lire le CSV");
    const text = await resp.text();
    const lines = text.trim().split("\n");
    const headers = lines[0] || "domain,name,password";
    const rows = lines.slice(1);

    rows.push(",,");

    const csvContent = [headers, ...rows].join("\n");

    await fetch("http://localhost:3001/api/save-csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: csvContent }),
    });

    const newIndex = rows.length - 1;
    router.push(`/${newIndex}`);
  } catch (err) {
    console.error("Erreur lors de l'ajout de la page:", err);
    alert("Impossible d'ajouter une page (voir la console).");
  }
};
</script>

<template>
  <div id="app-root">
    <header>
      <nav>
        <RouterLink to="/"
          ><img src="/logos/max.svg" alt="MOPass"
        /></RouterLink>
        <div id="Add" role="button" title="Ajouter" @click="addPage">
          <RiAddFill />
        </div>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
@use "variables" as v;

header {
  position: sticky;
  top: 0;
  background-color: v.$redApple;
  z-index: 10;

  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;

    img {
      height: 48px;
    }

    #Add {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      margin-left: 12px;
      cursor: pointer;
      transition: 0.18s background-color;
      border-radius: 6px;
      font-size: 22px;

      &:hover {
        background-color: v.$whiteSpirit;
      }
    }
  }
}

#app-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  display: flex;
  > * {
    width: 100%;
  }
}
</style>
