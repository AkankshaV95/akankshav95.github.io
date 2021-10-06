var app = new Vue({
    el: '#app',
    data: {
          users: null,
          currUser: null,
          home: true,
          posts: [],
          comments: [],
          new_comment: null,
          postIDs: {}
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
                  console.log(user);
                  axios
                    .get('https://my-json-server.typicode.com/akankshav95/demo/posts?userId='+id)
                    .then(json => {
                      console.log(json.data)
                      this.posts = json.data;
                      for(let post of this.posts) {
                        this.postIDs["post--"+post.id] = "post--"+post.id;
                      }
                    })
                })
                
          },
          newPost: function (user_id, post_data) {
            const body = JSON.stringify({userId: user_id, title: post_data});
            const headers = {'Content-type': 'application/json; charset=UTF-8'}
            axios({
              method: 'post',
              url:'https://my-json-server.typicode.com/akankshav95/demo/posts/',
              data: body,
              headers: headers
            }).then(response => {
              this.posts.push(response.data);
            })
          },
          getComments: function (post_id) {
            axios
              .get('https://my-json-server.typicode.com/akankshav95/demo/comments?postId='+post_id)
              .then(comments => {
                this.comments = comments.data;
                console.log(this.comments)
              })

          },
          postComment: function(post_id, comment) {
            console.log(post_id, comment);
            const body = JSON.stringify({postId: post_id, body: comment});
            const headers = {'Content-type': 'application/json; charset=UTF-8'}
            axios({
              method: 'post',
              url: 'https://my-json-server.typicode.com/akankshav95/demo/comments/',
              data: body,
              headers: headers
            }).then(response => {
                this.comments.push(response.data);
              })
          }
      }
  })