<header>
  <nav class="navbar navbar-expand-md navbar-dark bg-success">
    <a class="navbar-brand" href="/urls">TinyApp</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav">
        <a class="nav-item nav-link" href="/urls">My URLs</a>
        <a class="nav-item nav-link" href="/urls/new">Create New URL</a>
        </div>
    </div>
    <% if(user) { %>
      <form method="POST" action="/logout" class="form-inline">
        <div class="form-group form-inline">
          <label for=""><%= username %> logged in </label>
          <button type="submit" class="btn btn-outline-dark" style="margin: 1em">logout</button>
        </div>
      </form>

   <% } else {%> 
    <form method="POST" action="/login" class="form-inline">
      <div class="form-group form-inline">
        <input type="text" name="username">
        <button type="submit" class="btn btn-outline-dark" style="margin: 1em">Login</button>
      </div>
    </form>
    <% } %>
    <form method="GET" action="/register" class="form-inline">
      <div class="form-group form-inline">
        <button type="submit" class="btn btn-outline-dark" style="margin: 1em">Register</button>
      </div>
    </form>
    
    
  </nav>
</header>