<template>
  <footer class="footer py-6">
    <div class="footer__content px-4 d-flex justify-space-between align-center">
      <ul class="d-flex d-sm-inline-flex flex-wrap footer__content__list pa-0">
        <li>
          <a href="#">À propos</a>
        </li>
        <li>
          <a href="#">Mentions légales</a>
        </li>
        <li>
          <a href="#">Aide</a>
        </li>
        <li>
          <a href="#">Contact</a>
        </li>
      </ul>
      <span class="d-none d-sm-block">Groupomania © {{ new Date().getFullYear() }}</span>
    </div>
  </footer>
</template>

<script>
export default {
  data: () => ({}),
};
</script>

<style lang="scss" scoped>
.footer {
  background-color: #ffffff !important;
  border-top: 1px solid #f2f3f7 !important;
  &__content {
    max-width: 1400px;
    margin: auto;
    &__list {
      list-style: none;
      li {
        padding-right: 20px;
        a {
          text-decoration: none;
          color: rgba(0, 0, 0, 0.87);
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
