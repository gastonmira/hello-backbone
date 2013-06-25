define(['jquery', 
	    'underscore', 
	    'backbone',
	    'views/mainView',
	    'collections/movies',
	    'models/movie'
], function($, _, Backbone, MainView, CollectionMovies, ModelMovie){

	var listMovies = new CollectionMovies;

	var AppRouter = Backbone.Router.extend({
		
		routes: {
			"listMovies" : "showlisMovies",
			"showMovieForm"	 : "showForm", //para que muestre el form
			"delete/:id" : "deleteMovie",//elimina desde la coleccion
			"edit/:id"   : "editMovie",//edita desde mains
			"addMovie":"addMovie",
			"*actions"   : "defaultAction"

		},

	}); 

	

	var initialize = function(){
		
		var app_router = new AppRouter,
		mainView = new MainView;

		app_router.on('route:showlisMovies', function (){
			listMovies.fetch();		   
			mainView.collection = listMovies;
        	mainView.ShowListView();//carga el template con todas las pelilculas existentes        	
        	
		});

		app_router.on('route:showForm', function () {
			console.log('estoy en showMovieForm');
			mainView.ShowFormView();
		});

		app_router.on('route:addMovie', function () {
			
			if($('.submit').html() === "editar"){
				mainView.collection = listMovies;
             }else{
            
               var nId = (!listMovies.length) ? 1 : listMovies.last().get('id') + 1;
               var nModel = new ModelMovie({
               					id:nId,
               					title : $('#title').val(),
                                genre : $('#genre').val(),
                                sinopsis : $('#sinopsis').val(),
                                duration : $('#duration').val()
                              });
                listMovies.add(nModel);
                nModel.save();
            	
            }
            $('#buttonListMovies')       
            $('.cancel').click();
		});
		
		
		app_router.on( 'route:deleteMovie', function (id) {

			var nModel = listMovies.get(id);
            nModel.destroy();
            listMovies.remove();
            mainView.collection = listMovies;
            mainView.ShowListView();
            
		});

		app_router.on( 'route:editMovie', function (id) { 
			mainView.model = listMovies.get(id);
			mainView.EditMovie();
		});

		app_router.on( 'route:defaultAction', function( actions ){		

        	console.log('defaultAction');
        	

		});	
        
        Backbone.history.start();
       
	};
	

	return {
	
		initialize: initialize
			
	};

});