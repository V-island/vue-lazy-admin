<template>
    <div class="logo-warpper">
        <img :src="src" :alt="alt" />
    </div>
</template>

<script setup>
import logo from "@/assets/images/logo.svg"
const props = defineProps({
    size: { type: String || Number, default: "" },
    src: { type: String, default: logo },
    alt: { type: String, default: "logo" },
    fit: { type: String, default: "contain" },
})
</script>

<style scoped>
:host {
    --fit: v-bind('fit');
}

.logo-warpper {
    position: relative;
    z-index: 0;
    min-width: 16px;
    min-height: 16px;

    img {
        display: block;
        position: absolute;
        z-index: 0;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: var(--fit);
    }
}
</style>