<template>
  <div :class="$route.meta.parent ? 'page-header blue-tip' : 'page-header'">
    <div class="page-header-index-wide">
      <div class="detail">
        <div class="main" v-if="!$route.meta.hiddenHeaderContent">
          <div class="row">
            <img v-if="logo" :src="logo" class="logo"/>
            <h1 v-if="title" class="title">
              <span v-if="this.$route.query.type==='Details'">{{ title + ' ' + this.$route.query.type || '' }}</span>
              <span v-else>{{ this.$route.query.type || '' + ' ' + title }}</span>
            </h1>
            <!-- <page-header-placement /> -->
            <div class="action">
              <slot name="action">
                <a v-if="$route.meta.hidden" @click="goPage($route.meta.parent)"><img src="/icon/close.svg" /></a>
              </slot>
            </div>
          </div>
          <div class="row">
            <div v-if="avatar" class="avatar">
              <a-avatar :src="avatar" />
            </div>
            <div v-if="this.$slots.content" class="headerContent">
              <slot name="content"></slot>
            </div>
            <div v-if="this.$slots.extra" class="extra">
              <slot name="extra"></slot>
            </div>
          </div>
          <div>
            <slot name="pageMenu"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeaderPlacement from '@/components/om/PageHeaderPlacement'

export default {
  name: 'PageHeader',
  components: {
    PageHeaderPlacement
  },
  props: {
    title: {
      type: [String, Boolean],
      default: true,
      required: false
    },
    logo: {
      type: String,
      default: '',
      required: false
    },
    avatar: {
      type: String,
      default: '',
      required: false
    }
  },
  methods: {
    goPage (path) {
      this.$router.push({
        path
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .blue-tip {
    display: inline-block;
    width: calc(100vw - 256px);
    margin-left: -16px;
    padding-top: 16px;
    margin-top: 48px !important;
    background: #5F9CF1;
  }
  .page-header {
    .detail {
      display: flex;
      .avatar {
        flex: 0 1 72px;
        margin: 0 24px 8px 0;

        & > span {
          border-radius: 72px;
          display: block;
          width: 72px;
          height: 72px;
        }
      }

      .main {
        width: 100%;
        flex: 0 1 auto;

        .row {
          display: flex;
          width: 100%;

          .avatar {
            margin-bottom: 16px;
          }
        }

        .title {
          font-size: 20px;
          font-weight: 500;
          font-size: 20px;
          line-height: 28px;
          font-weight: bold;
          color: #FFFFFF;
          margin-bottom: 16px;
          margin-left:40px;
          flex: auto;
        }
        .logo {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          margin-right: 16px;
        }
        .content,
        .headerContent {
          flex: auto;
          color: rgba(0, 0, 0, 0.45);
          line-height: 22px;

          .link {
            margin-top: 16px;
            line-height: 24px;

            a {
              font-size: 14px;
              margin-right: 32px;
            }
          }
        }
        .extra {
          flex: 0 1 auto;
          margin-left: 88px;
          min-width: 242px;
          text-align: right;
        }
        .action {
          margin-left: 56px;
          min-width: 266px;
          flex: 0 1 auto;
          margin-right: 16px;
          text-align: right;
          &:empty {
            display: none;
          }
        }
      }
    }
  }

  .mobile .page-header {
    .main {
      .row {
        flex-wrap: wrap;

        .avatar {
          flex: 0 1 25%;
          margin: 0 2% 8px 0;
        }

        .content,
        .headerContent {
          flex: 0 1 70%;

          .link {
            margin-top: 16px;
            line-height: 24px;

            a {
              font-size: 14px;
              margin-right: 10px;
            }
          }
        }

        .extra {
          flex: 1 1 auto;
          margin-left: 0;
          min-width: 0;
          text-align: right;
        }

        .action {
          margin-left: unset;
          min-width: 266px;
          flex: 0 1 auto;
          text-align: left;
          margin-bottom: 12px;

          &:empty {
            display: none;
          }
        }
      }
    }
  }
</style>
