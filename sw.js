
//const CACHE_NAME = 'cache-1';

const CACHE_STATIC_NAME = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';

const CACHE_INMUTABLE_NAME = 'inmutable-v1';

self.addEventListener('install', e => {

    const cacheProm = caches.open( CACHE_STATIC_NAME ).then( cache => {

        return cache.addAll([
            '/',
            '/index.html',
            '/css/style.css',
            '/img/main.jpg',
            //'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
            '/js/app.js'
        ]);
    });

    const cacheInmutable =  caches.open( CACHE_INMUTABLE_NAME )
    .then( cache => {

        return cache.addAll([
            'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
        ])
    });

    e.waitUntil( Promise.all([cacheProm, cacheInmutable]) );

});


self.addEventListener('fetch', e => {

    //1. cache only
    //e.respondWith( caches.match( e.request));

    //2. cache with netwirk fallback
    const respuesta = caches.match( e.request ).then( res => {

        if ( res ) return res;

        //No existe el archivo y tengo que ir a la web
        console.log('No existe', e.request.url);

        return fetch( e.request ).then( newResp => {

            caches.open( CACHE_DYNAMIC_NAME ).then( cache => {
                cache.put( e.request, newResp );
            });

            return newResp.clone();
        });
    });

    e.respondWith( respuesta );
});