var app = new Vue({
    el: '#app',
    data: {
          users: null,
          currUser: {},
          home: true,
          posts: [],
          comments: {},
          new_comment: null,
          postIDs: {},
          new_post: null,
          post_id: null,
          show_comments: false,
      },
      mounted () {
        axios
          .get('https://my-json-server.typicode.com/akankshav95/demo/users')
          .then(response => {
            this.users = response.data;
          })
      },
      methods: {
          getPosts: function (id) {
              console.log(id);
              this.home = false;
              axios
                .get('https://my-json-server.typicode.com/akankshav95/demo/users/'+id)
                .then(user => {
                  this.currUser = user.data;
                  this.comments = {};
                  this.postIDs = {};
                  axios
                    .get('https://my-json-server.typicode.com/akankshav95/demo/posts?userId='+id)
                    .then(json => {
                      console.log(json.data)
                      this.posts = json.data;
                      this.new_post = null;
                      this.comments[this.currUser.id] = {} 
                      for(let post of this.posts) {
                        this.postIDs[post.id] = null;
                      }
                    })
                })
          },
          newPost: function (user_id, post_data) {
            const body = JSON.stringify({userId: user_id, title: post_data});
            const headers = {'Content-type': 'application/json; charset=UTF-8'}
            console.log(body);
            axios({
              method: 'post',
              url:'https://my-json-server.typicode.com/akankshav95/demo/posts/',
              data: body,
              headers: headers
            }).then(response => {
              console.log(response.data);
              this.posts.push(response.data);
              this.postIDs[response.data.id] = null;
              this.new_post = null;
              // this.currUser.posts.push(response.data);
            })
          },
          getComments: function (post_id) {
            console.log(post_id);
            if(post_id in this.comments[this.currUser.id]) return;
            axios
              .get('https://my-json-server.typicode.com/akankshav95/demo/comments?postId='+post_id)
              .then(comments => {
                this.comments[this.currUser.id][post_id] = comments.data;
                this.post_id = post_id;
                console.log(this.currUser.id, post_id);
              })

          },
          postComment: function(post_id, comment) {
            console.log(post_id, comment);
            console.log(this.comments)
            console.log("post id - ", post_id, typeof post_id)
            const body = JSON.stringify({postId: post_id, body: comment});
            const headers = {'Content-type': 'application/json; charset=UTF-8'};
            if (!(Object.keys(this.comments[this.currUser.id]).includes(post_id))) {
              axios
              .get('https://my-json-server.typicode.com/akankshav95/demo/comments?postId='+post_id)
              .then(comments => {
                this.comments[this.currUser.id][post_id] = comments.data;
                axios({
                  method: 'post',
                  url: 'https://my-json-server.typicode.com/akankshav95/demo/comments/',
                  data: body,
                  headers: headers
                }).then(response => {
                    this.comments[this.currUser.id][post_id].push(response.data);
                    console.log(this.comments);
                    this.post_id = post_id;
                  })
              })
            } else {
              axios({
                method: 'post',
                url: 'https://my-json-server.typicode.com/akankshav95/demo/comments/',
                data: body,
                headers: headers
              }).then(response => {
                console.log("else - ", this.comments);
                  this.comments[this.currUser.id][post_id].push(response.data);
                  this.post_id = post_id;

                })  
            }
          }
      }
  })