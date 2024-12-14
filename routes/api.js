router.get('/movies/:movieId/details', movieController.getMovieDetails);
router.get('/movies/:movieId/credits', movieController.getMovieCredits);
router.get('/tv/:tvId/details', tvController.getTvShowDetails);
router.get('/tv/:tvId/credits', tvController.getTvShowCredits); 