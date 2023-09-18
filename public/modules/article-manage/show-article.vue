<template>
  <div class="show-article-container" v-html="content"></div>
</template>

<script>
import { getArticleDetail } from 'api/article-manage/index';
export default {
  name: 'show-article',
  data() {
    return { content: '' };
  },
  activated() {
    this.getArticleDetail();
  },
  methods: {
    async getArticleDetail() {
      const articleId = this.$route.query.articleId;
      if (this._isNotEmpty(articleId)) {
        const [err, data] = await this._awaitWrap(getArticleDetail(articleId));
        if (err) {
          this.$message.error('获取文章详情失败');
          this.$router.back();
          return;
        }
        if (data && data.code === 0) {
          this.content = data.data.content;
        } else {
          this.$message.error(data.msg);
        }
      }
    },
  },
};
</script>

<style lang="scss">
.show-article-container {
  /* table 样式 */
  table {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }
  table td,
  table th {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 3px 5px;
  }
  table th {
    border-bottom: 2px solid #ccc;
    text-align: center;
  }

  /* blockquote 样式 */
  blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
  }

  /* code 样式 */
  code {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
  }
  pre code {
    display: block;
  }

  /* ul ol 样式 */
  ul,
  ol {
    margin: 10px 0 10px 20px;
  }
}
</style>
