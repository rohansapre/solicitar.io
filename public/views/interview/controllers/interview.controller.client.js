/**
 * Created by tushargupta on 3/31/17.
 */
(function () {
    angular
        .module("ProjectMaker")
        .controller("interviewController", interviewController);

    function interviewController($routeParams, $location, playgroundService) {
        //     $('body').removeClass('dashboardMargin');
        var vm = this;

        //vm.createNewPad = createNewPad;
        vm.compile = compile;
        vm.getResults = getResults;
        vm.changeLanguage = changeLanguage;


        vm.cameraPreview = cameraPreview;
        vm.joinRoom = joinRoom;
        vm.leaveRoom = leaveRoom;

        vm.endInterview = endInterview;

        vm.languages = ['Python', 'Java', 'C++'];
        var languageId = 4;
        var firepadReference;
        var submissionId;
        var messages = [];
        var peer_id, name, conn;
        var peer;
        var twilioData;
        vm.chatHide = true;
        vm.ownIdHide = true;
        vm.lol = "afasfs";
        vm.ownId = "dd";

        vm.language = 'Python';
        var ownId;
        var editor;
        vm.key = '-Kh9odJIjnUeoAQue4Al';

        // ---- code Mirror options -------
        var pythonOptions = {
            name: "Python",
            version: 2,
            singleLineStringErrors: false
        };
        var javaOptions = "text/x-java";

        var cppOptions = "text/x-c++src";
        var javaInitializationCode = "/* package whatever; // don't place package name! */\nimport java.io.*;\nimport java.util.Scanner;\npublic class program {\n public static void main(String[] args) {\n \tSystem.out.println(\"Hello Java\");\n \tScanner sc = new Scanner(System.in);\n \tString a = sc.nextLine();\n}";
        var pythonInitializationCode = "print \"Hello World\"";
        var cppInitializationCode = "\#include \<iostream\>\nusing namespace std;\nint main() {\ncout<<\"Hello\";\nreturn 0;\n}"
        // ------------------------------

        // Twilio

        var activeRoom;
        var previewTracks;
        var identity;
        var roomName;


        function init() {
            $("body").removeClass("dashboardMargin");
            vm.ownId = ownId;

            initializePad();

            initializeTwilio();


            //setupTwilio();
        }

        init();


        //-------------- START TWILIO --------------------------

        function initializeTwilio() {

            // Check for WebRTC
            if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
                alert('WebRTC is not available in your browser.');
                // do something
            }

            // When we are about to transition away from this page, disconnect
            // from the room, if joined.
            window.addEventListener('beforeunload', leaveRoomIfJoined);

            vm.joinDisabled = true;
            vm.leaveDisabled = true;

            // token initialization
            var tokenPromise = playgroundService.getToken();

            tokenPromise.success(function (data) {
                identity = data.identity;
                console.log("identity");
                console.log(identity);

                document.getElementById('room-controls').style.display = 'block';

                vm.joinDisabled = false;
                vm.leaveDisabled = false;
                twilioData = data;


            });


        }


        function setupTwilio() {
            //TODO: setup camera and microphone, try to connect to the room

            // When we are about to transition away from this page, disconnect
            // from the room, if joined.
            window.addEventListener('beforeunload', leaveRoomIfJoined);


            var tokenPromise = playgroundService.getToken();

            tokenPromise.success(function (data) {

                identity = data.identity;
                console.log("identity");
                console.log(identity);

                document.getElementById('room-controls').style.display = 'block';

                vm.joinDisabled = false;
                vm.leaveDisabled = false;
                twilioData = data;

                playgroundService.getTwilioRoom().success(function (data) {

                    roomName = data['roomName'];
                    joinRoom();

                }).error(function (err) {
                    console.log(err);
                });

            }).error(function (err) {
                console.log(err);
            });


        }

        // Onclick functions

        function cameraPreview() {
            var localTracksPromise =
                previewTracks
                    ? Promise.resolve(previewTracks)
                    : Twilio.Video.createLocalTracks();

            localTracksPromise.then(function (tracks) {
                previewTracks = tracks;
                var previewContainer = document.getElementById('local-media');
                if (!previewContainer.querySelector('video')) {
                    attachTracks(tracks, previewContainer);
                }
            }, function (error) {
                console.error('Unable to access local media', error);
                console.log('Unable to access Camera and Microphone');
            });
        }

        function joinRoom() {
            roomName = document.getElementById('room-name').value;
            if (roomName) {
                console.log("Joining room '" + roomName + "'...");

                var connectOptions = {name: roomName, logLevel: 'debug'};
                if (previewTracks) {
                    connectOptions.tracks = previewTracks;
                }

                Twilio.Video.connect(twilioData.token, connectOptions).then(roomJoined, function (error) {
                    console.log('Could not connect to Twilio: ' + error.message);
                });
            } else {
                alert('Please enter a room name.');
            }
        }

        function leaveRoom() {
            console.log('Leaving room...');
            activeRoom.disconnect();
        }

        //------------------------------------------------------------------

        // Attach detach rooms
        function attachTracks(tracks, container) {
            tracks.forEach(function (track) {
                container.appendChild(track.attach());
            });
        }

        function attachParticipantTracks(participant, container) {
            var tracks = Array.from(participant.tracks.values());
            attachTracks(tracks, container);
        }

        function detachTracks(tracks) {
            tracks.forEach(function (track) {
                track.detach().forEach(function (detachedElement) {
                    detachedElement.remove();
                });
            });
        }

        function detachParticipantTracks(participant) {
            var tracks = Array.from(participant.tracks.values());
            detachTracks(tracks);
        }

        function leaveRoomIfJoined() {
            if (activeRoom) {
                activeRoom.disconnect();
            }
        }


        //---------------------------------

        // Successfully connected!
        function roomJoined(room) {
            activeRoom = room;

            console.log("Joined as '" + identity + "'");
            document.getElementById('button-join').style.display = 'none';
            document.getElementById('button-leave').style.display = 'inline';

            // Draw local video, if not already previewing
            var previewContainer = document.getElementById('local-media');
            if (!previewContainer.querySelector('video')) {
                attachParticipantTracks(room.localParticipant, previewContainer);
            }

            room.participants.forEach(function (participant) {
                console.log("Already in Room: '" + participant.identity + "'");
                var previewContainer = document.getElementById('remote-media');
                attachParticipantTracks(participant, previewContainer);
            });

            // When a participant joins, draw their video on screen
            room.on('participantConnected', function (participant) {
                console.log("Joining: '" + participant.identity + "'");
            });

            room.on('trackAdded', function (track, participant) {
                console.log(participant.identity + " added track: " + track.kind);
                var previewContainer = document.getElementById('remote-media');
                attachTracks([track], previewContainer);
            });

            room.on('trackRemoved', function (track, participant) {
                console.log(participant.identity + " removed track: " + track.kind);
                detachTracks([track]);
            });

            // When a participant disconnects, note in log
            room.on('participantDisconnected', function (participant) {
                console.log("Participant '" + participant.identity + "' left the room");
                detachParticipantTracks(participant);
            });

            // When we are disconnected, stop capturing local video
            // Also remove media for all remote participants
            room.on('disconnected', function () {
                console.log('Left');
                detachParticipantTracks(room.localParticipant);
                room.participants.forEach(detachParticipantTracks);
                activeRoom = null;
                document.getElementById('button-join').style.display = 'inline';
                document.getElementById('button-leave').style.display = 'none';
            });
        }


        //----------------------------------


        function log(message) {
            var logDiv = document.getElementById('log');
            logDiv.innerHTML += '<p>&gt;&nbsp;' + message + '</p>';
            logDiv.scrollTop = logDiv.scrollHeight;
        }


        //-------------- END TWILIO --------------------------


        // ---------- Firepad -----------------


        function getCodeMirrorMode() {
            switch (vm.language) {
                case 'Python':
                    return pythonOptions;
                case 'Java':
                    return javaOptions;
                case 'C++':
                    return cppOptions;
            }
            return null;
        }

        // function createNewPad() {
        //
        //     //var ref = firebase.database().ref();
        //     //ref = ref.child('codepadList').push(); // generate unique location.
        //     //window.location = window.location + '#' + ref.key; // add it as a hash to the URL.
        //     $location.url("/user/" + $routeParams['uid'] + "/interview/" + 'dfssd');
        // }

        function initializePad() {
            var myTextarea = document.getElementById("myCode");
            console.log(myTextarea);
            editor = CodeMirror(myTextarea, {
                mode: getCodeMirrorMode(),
                lineNumbers: true,
                matchBrackets: true,
                theme: 'base16-dark'
            });

            editor.setOption("theme", "base16-dark");


            // Get Firebase Database reference.
            // var firepadRef = firebase.database().ref();
            // var key= firepadRef.child('codepadList').push();
            // var actualKey = key.key
            // var java = "Java"
            // firepadRef.child("codepadList").child(actualKey).set({
            //     "Language":"Java"
            // });
            var firebaseReference = firebase.database().ref().child('solicitarInterview').child(vm.key);


            var firepad = Firepad.fromCodeMirror(firebaseReference, editor, {
                defaultText: pythonInitializationCode
            });
            firepadReference = firepad;

            if (typeof console !== 'undefined') {
                console.log('Firebase data: ', firebaseReference.toString());
            }

            $('.powered-by-firepad').remove();

            var starCountRef = firebase.database().ref().child('solicitarInterview').child(vm.key).child('language');
            starCountRef.on('value', function (snapshot) {
                console.log(vm.language + snapshot.val());
                if (snapshot.val() != vm.language)
                    changeLanguageWithoutUpdate(snapshot.val());
                console.log(vm.language);
            });

        }

        function compile() {
            // console.log("ffdfdf");
            // console.log(playgroundService.compile());
            var data = {};
            vm.result = "Compiling code...";
            data['sourceCode'] = firepadReference.getText().toString();
            data['language'] = languageId;
            data['input'] = vm.input;
            vm.compiling = true;
            playgroundService.compile(data)
                .success(function (res) {
                    submissionId = res.id;

                    console.log(res);
                    setTimeout(function () {
                        getResults();
                    }, 3000);

                })
                .error(function (err) {
                    vm.compiling = false;
                    console.log(err);
                });

        }

        function getResults() {
            var redo = false;
            playgroundService.getSubmissionResult(submissionId)
                .success(function (result) {
                    vm.compiling = false;
                    if (result.status < 0 || result.status == 1 || result.status == 3)
                        redo = true;
                    if (result.result == 15)
                        vm.result = result.output;
                    else if (result.result == 13 || result.result == 17 || result.result == 19 || result.result == 20 || result.result == 11 || result.result == 12) {
                        if(result.stderr != "")
                            vm.result = result.stderr+"\n"+result.cmpinfo;
                        else
                            vm.result= result.cmpinfo;
                    }

                })
                .error(function (err) {
                        console.log(err);
                    }
                );

            if (redo)
                compile();
        }

        function changeLanguageWithoutUpdate(c) {
            console.log("language");
            console.log(vm.language + c);
            console.log("change is constant");
            // firebase.database().ref().child('solicitarInterview').child(vm.key)
            //     .set({
            //         'language':c
            //     });
            switch (c) {
                case 'Python': {
                    editor.setOption('mode', pythonOptions);
                    editor.setOption('indentUnit', 4);
                    editor.setOption('tabMode', "shift");
                    languageId = 4;
                    firepadReference.setText(pythonInitializationCode);
                    vm.language = "Python";
                    break;
                }
                case 'Java': {
                    editor.setOption('mode', javaOptions);
                    languageId = 10;
                    vm.language = "Java";
                    firepadReference.setText(javaInitializationCode);
                    break;
                }
                case 'C++': {
                    editor.setOption('mode', cppOptions);
                    languageId = 1;
                    vm.language = "C++";
                    firepadReference.setText(cppInitializationCode);
                    break;
                }

            }

            console.log(editor.getOption('mode'));


        }

        function changeLanguage(c) {
            console.log("language");
            console.log(vm.language);

            if (vm.language != c) {
                var updates = {};
                console.log("change is constant");
                updates['/solicitarInterview/' + vm.key + '/language'] = c;
                firebase.database().ref().update(updates);
                // firebase.database().ref().child('solicitarInterview').child(vm.key)
                //     .set({
                //         'language':c
                //     });
                switch (c) {
                    case 'Python': {
                        editor.setOption('mode', pythonOptions);
                        editor.setOption('indentUnit', 4);
                        editor.setOption('tabMode', "shift");
                        languageId = 4;
                        firepadReference.setText(pythonInitializationCode);
                        vm.language = "Python";
                        break;
                    }
                    case 'Java': {
                        editor.setOption('mode', javaOptions);
                        languageId = 10;
                        vm.language = "Java";
                        firepadReference.setText(javaInitializationCode);
                        break;
                    }
                    case 'C++': {
                        editor.setOption('mode', cppOptions);
                        languageId = 1;
                        vm.language = "C++";
                        firepadReference.setText(cppInitializationCode);
                        break;
                    }

                }

                console.log(editor.getOption('mode'));

            }
        }


        // ----- END Firepad -----------

        function endInterview() {
            // pass the current interview ID
            $("body").addClass("dashboardMargin");
            InterviewService.endInterview(interviewId)
                .success(function (interview) {
                    console.log(interview);
                })
                .error(function (error) {
                    console.log("error");
                    console.log(error);
                });
            $location.url('')

        }

    }
})();