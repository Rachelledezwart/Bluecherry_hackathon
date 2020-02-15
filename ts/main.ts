/*
* Default pattern for setting up an app.
*/
const app : any = {};

//IIFC
(function ()
{
    /**
     * Run after dom is ready
     */
    let init = function ()
    {
        app.game = new Game();
    };

    window.addEventListener('load', init);
})();
