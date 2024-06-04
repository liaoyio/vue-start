<script setup lang="ts"></script>

<template>
  <main>
    <header class="mt-header my-4">
      <h3>General</h3>
    </header>
    <section px="6" py="2">
      <a-card>
        <div class="flex_lr">
          <div>
            <h3>Organization Information</h3>
            <p class="tips mt-2">Used to identify your organization on MontCache</p>
          </div>
          <div>
            <a-button type="primary">Update</a-button>
          </div>
        </div>

        <ul class="bento-card mt-8">
          <li>
            <div>Organization ID</div>
            <div>1372813089209229826</div>
          </li>
          <li>
            <div>Creation Time</div>
            <div>2024-05-25 12:42:55</div>
          </li>
          <li class="flex-50">
            <div>Organization Name *</div>
            <div>
              <a-input class="!w-full" size="large" placeholder="Organization Name" />
            </div>
          </li>
        </ul>
      </a-card>
    </section>
  </main>
</template>

<style lang="scss">
.bento-card li {
  &:last-child {
    flex: 0 0 50%;
    max-width: 50%;
  }

  div:nth-child(2) {
    margin-top: 16px;
    line-height: 40px;
    color: var(--tips-text-color);
  }
}
</style>
