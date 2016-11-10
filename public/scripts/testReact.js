//Scripts for the Example Project

//===================
//__COMMENT MODULES__
//==
// Practictioner: Joshua R. Engel
// Description: Create 4 Modules for use in a live commenting site, similar to Facebook or Twitter
//==
// Work Begin: 10/13/16
// Last Modified: 10/14/16
//==
// Status: _Incomplete_
//___________________

//===================
//Commment Box Module
//--
var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
   $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,

      success: function(data){
        this.setState({data:data});
      }.bind(this),

      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)

    });
  },

  handleCommentSubmit: function(comment) {
    var comments = this.state.data;

    //Create a temp ID for the temporary comment display
    comment.id = Date.now();

    //Attach the id to the current data state of the input
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,

      success: function(data){
        this.setState({data: data});
      }.bind(this),

      error: function(xhr, status, err) {
        this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function(){
    return {data: []};
  },

  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },

  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }

});
//--
//Comment Box End
//___________________

//===================
//Comment List Module
//--
var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });
    
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});
//--
// Comment List End
//___________________

//===================
// Comments Module Start
//--
var Comment = React.createClass({
  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },

  render: function(){    
    return (
      <div className="comment">      
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  
  }
});

//--
// Comments End
//___________________

//===================
// Commment Form Module
//--
var CommentForm = React.createClass({
  //Gets called when a React component is created
  //Instantiate this component with default and blank values
  getInitialState: function(){
    return {author: '', text: ''};
  },

  //We want to maintain control of the author input element instead of the browser
  handleAuthorChange: function(e){
    this.setState({author: e.target.value});
  },

  //We want to maintain control of the text/comment input element instead of the browser
  handleTextChange: function(e){
    this.setState({text: e.target.value});
  },

  handleSubmit: function(e){
    e.preventDefault();

    var author = this.state.author.trim();
    var text = this.state.text.trim();

    if (!text || !author) {
      return;
    }
    //TODO: Send request to the server
    this.props.onCommentSubmit({author: author, text: text});

    //Clear the values of the rendered input elements
    this.setState({author: '', text: ''});
  },

  //Called at the end of the component creation
  //This is what actually shows up in the DOM when ReactJS calls this component
  render: function(){
    return (

      <form className="commentForm" onSubmit={this.handleSubmit}>

        {/*Author Name */}
        <input 
          type="text"
          placeholder="Your Name" 
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />

        {/*Comment's Text/Content*/}
        <input 
          type="text" 
          placeholder="What's on your mind?" 
          value={this.state.text}
          onChange={this.handleTextChange}
        />

        {/*Comment Submit Button*/}
        <input type="submit" value="Post" />
      
      </form>
    );
  }
});

//--
// Comment Form End
//___________________



//===================
// Begin the React Renderer 
//--
  ReactDOM.render(
    <CommentBox url="api/comments" pollInterval={2000} />, 
    document.getElementById('content')
  );
//--
// React Renderer End
//___________________