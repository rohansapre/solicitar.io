/**
 * Created by amulmehta on 3/22/17.
 */
(function () {
    angular
        .module("ProjectMaker")
        .controller("playgroundController", playgroundController);

    function playgroundController($location, $routeParams, playgroundService) {
        var vm = this;

        vm.createNewPad = createNewPad;
        vm.compile = compile;
        vm.getResults = getResults;
        var firepadReference;
        var submissionId;

        function init() {
            var padId = $routeParams['pgid'];

            if (padId == null) {
                //initializePad();
                vm.visible = true;
            }
            else {
                vm.visible = false;
                initializePad()
            }
            console.log("fsdfsdfsdfs");
            // var config = {
            //     apiKey: "AIzaSyAYz-syxAzb9v4t1jdpDCowwThCLhEqEf8",
            //     authDomain: "playground-9b472.firebaseapp.com",
            //     databaseURL: "https://playground-9b472.firebaseio.com",
            //     storageBucket: "playground-9b472.appspot.com",
            //     messagingSenderId: "406699422715"
            // };
            // firebase.initializeApp(config);
            //
            // var myTextarea = document.getElementById("myCode");
            // console.log(myTextarea);
            // var editor = CodeMirror(myTextarea, {
            //     lineNumbers: true
            // });
            //
            // // Get Firebase Database reference.
            // var firepadRef = firebase.database().ref();
            //
            // var firepad = Firepad.fromCodeMirror(firepadRef, editor, {
            //     defaultText: 'Hello, World!'
            // });
            // // Helper to get hash from end of URL or generate a random one.
            // function getExampleRef() {
            //     var ref = firebase.database().ref();
            //
            //     if ($routeParams['pgid']) {
            //         console.log("sadas");
            //         ref = ref.child(hash);
            //     } else {
            //         ref = ref.push(); // generate unique location.
            //         //window.location = window.location + '#' + ref.key; // add it as a hash to the URL.
            //         $location.url("/playground/#"+ref.key);
            //     }
            //     if (typeof console !== 'undefined') {
            //         console.log('Firebase data: ', ref.toString());
            //     }
            //     return ref;
            // }
            //
            // console.log(getExampleRef());

            // function thirty_pc() {
            //     var height = $(window).height();
            //     thirtypc = parseInt(height*0.90) + 'px';
            //     $("div").css('height',thirtypc);
            // }
            //
            // $(document).ready(function() {
            //     thirty_pc();
            //     $(window).bind('myCode', thirty_pc);
            // });

        }

        init();

        function createNewPad() {

            var ref = firebase.database().ref();
            ref = ref.push(); // generate unique location.
            //window.location = window.location + '#' + ref.key; // add it as a hash to the URL.
            $location.url("/playground/" + ref.key);
        }

        function initializePad() {
            var myTextarea = document.getElementById("myCode");
            console.log(myTextarea);
            var editor = CodeMirror(myTextarea, {
                lineNumbers: true
            });

            // Get Firebase Database reference.
            var firepadRef = firebase.database().ref();

            var firepad = Firepad.fromCodeMirror(firepadRef, editor, {
                defaultText: 'Hello, World!'
            });
            firepadReference = firepad;
            var padId = $routeParams['pgid'];
            console.log("sadas");
            firepadRef = firepadRef.child(padId);


            if (typeof console !== 'undefined') {
                console.log('Firebase data: ', firepadRef.toString());
            }

        }

        function compile() {
            // console.log("ffdfdf");
            // console.log(playgroundService.compile());
            var data ={};
            data['sourceCode']= firepadReference.getText().toString();
            data['language'] = 4;
            data['input'] =" ";

            playgroundService.compile(data)
                .success(function (res) {
                    submissionId= res.id;
                    console.log(res);
                })
                .error(function (err) {
                    console.log(err);
                });

        }
        function getResults() {
            playgroundService.getSubmissionResult(submissionId)
                .success(function (result) {
                    if(result.result == 15)
                        vm.result ="Output :   "+result.output;
                })
                .error(function (err) {
                        console.log(err);
                    }
                )

        }

    }
})();