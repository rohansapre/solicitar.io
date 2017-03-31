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
        vm.login = login;
        vm.call = call;



        vm.cameraPreview = cameraPreview;
        vm.joinRoom = joinRoom;
        vm.leaveRoom = leaveRoom;

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
        var ownId;


        // Twilio

        var activeRoom;
        var previewTracks;
        var identity;
        var roomName;


        function init() {
            var padId = $routeParams['pgid'];
            if (padId == null) {
                vm.visible = true;
            }
            else {
                vm.visible = false;
                initializePad()
            }
            vm.ownId = ownId;
            initializeTwilio();
            // navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            // initializeWebRTC();

        }

        init();



        //-------------- START TWILIO --------------------------

        function initializeTwilio(){

            // Check for WebRTC
            if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
                alert('WebRTC is not available in your browser.');
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

        // Onclick functions

        function cameraPreview() {
            var localTracksPromise =
                previewTracks
                ? Promise.resolve(previewTracks)
                : Twilio.Video.createLocalTracks();

            localTracksPromise.then(function(tracks) {
                previewTracks = tracks;
                var previewContainer = document.getElementById('local-media');
                if (!previewContainer.querySelector('video')) {
                    attachTracks(tracks, previewContainer);
                }
            }, function(error) {
                console.error('Unable to access local media', error);
                log('Unable to access Camera and Microphone');
            });
        }

        function joinRoom() {
            roomName = document.getElementById('room-name').value;
            if (roomName) {
                log("Joining room '" + roomName + "'...");

                var connectOptions = { name: roomName, logLevel: 'debug' };
                if (previewTracks) {
                    connectOptions.tracks = previewTracks;
                }

                Twilio.Video.connect(twilioData.token, connectOptions).then(roomJoined, function(error) {
                    log('Could not connect to Twilio: ' + error.message);
                });
            } else {
                alert('Please enter a room name.');
            }
        }

        function leaveRoom() {
            log('Leaving room...');
            activeRoom.disconnect();
        }

        //------------------------------------------------------------------

        // Attach detach rooms
        function attachTracks(tracks, container) {
            tracks.forEach(function(track) {
                container.appendChild(track.attach());
            });
        }

        function attachParticipantTracks(participant, container) {
            var tracks = Array.from(participant.tracks.values());
            attachTracks(tracks, container);
        }

        function detachTracks(tracks) {
            tracks.forEach(function(track) {
                track.detach().forEach(function(detachedElement) {
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

            log("Joined as '" + identity + "'");
            document.getElementById('button-join').style.display = 'none';
            document.getElementById('button-leave').style.display = 'inline';

            // Draw local video, if not already previewing
            var previewContainer = document.getElementById('local-media');
            if (!previewContainer.querySelector('video')) {
                attachParticipantTracks(room.localParticipant, previewContainer);
            }

            room.participants.forEach(function(participant) {
                log("Already in Room: '" + participant.identity + "'");
                var previewContainer = document.getElementById('remote-media');
                attachParticipantTracks(participant, previewContainer);
            });

            // When a participant joins, draw their video on screen
            room.on('participantConnected', function(participant) {
                log("Joining: '" + participant.identity + "'");
            });

            room.on('trackAdded', function(track, participant) {
                log(participant.identity + " added track: " + track.kind);
                var previewContainer = document.getElementById('remote-media');
                attachTracks([track], previewContainer);
            });

            room.on('trackRemoved', function(track, participant) {
                log(participant.identity + " removed track: " + track.kind);
                detachTracks([track]);
            });

            // When a participant disconnects, note in log
            room.on('participantDisconnected', function(participant) {
                log("Participant '" + participant.identity + "' left the room");
                detachParticipantTracks(participant);
            });

            // When we are disconnected, stop capturing local video
            // Also remove media for all remote participants
            room.on('disconnected', function() {
                log('Left');
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
















        // function getVideo(callback){
        //     navigator.getUserMedia({audio: true, video: true}, callback, function(error){
        //         console.log(error);
        //         alert('An error occured. Please try again');
        //     });
        // }
        //
        // getVideo(function(stream){
        //     window.localStream = stream;
        //     onReceiveStream(stream, 'my-camera');
        // });
        //
        // function onReceiveStream(stream, element_id){
        //     var video = $('#' + element_id + ' video')[0];
        //
        //     console.log("Stream");
        //     console.log(element_id);
        //     console.log(stream);
        //     console.log(window.URL.createObjectURL(stream));
        //     video.src = window.URL.createObjectURL(stream);
        //     window.peer_stream = stream;
        // }
        //
        //
        //
        // function handleMessage(data){
        //     var header_plus_footer_height = 285;
        //     var base_height = $(document).height() - header_plus_footer_height;
        //     var messages_container_height = $('#messages-container').height();
        //     messages.push(data);
        //
        //     var html = messages_template({'messages' : messages});
        //     $('#messages').html(html);
        //
        //     if(messages_container_height >= base_height){
        //         $('html, body').animate({ scrollTop: $(document).height() }, 500);
        //     }
        // }
        // function updateID(id) {
        //     vm.ownId =id.toString();
        //     console.
        //         log(vm.ownId);
        // }
        // function initializeWebRTC() {
        //     peer = new Peer({
        //         key:'2uclde8kln3a0pb9',
        //         debug: 3,
        //         config: {'iceServers': [
        //         { url: 'stun:stun.l.google.com:19302' }, // Pass in optional STUN and TURN server for maximum network compatibility
        //         { url: 'turn:numb.viagenie.ca:3478', credential: 'muazkh', username:'webrtc@live.com' },
        //         { url: 'turn:numb.viagenie.ca', credential: 'muazkh', username:'webrtc@live.com' },
        //         { url: 'turn:numb.viagenie.ca:3478', credential: 'peerjsdemo', username:'p.srikanta@gmail.com' },
        //         { url: 'turn:192.158.29.39:3478?transport=udp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username:'28224511:1379330808' },
        //         { url: 'turn:192.158.29.39:3478?transport=tcp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username:'28224511:1379330808' }
        //         ]}
        //     });
        //     peer.on('open', function(){
        //         console.log("my id");
        //         console.log(peer.id);
        //         ownId = peer.id;
        //         updateID(peer.id);
        //     });
        //
        //     peer.on('connection', function(connection){
        //         conn = connection;
        //         peer_id = connection.peer;
        //         conn.on('data', handleMessage);
        //
        //         // $('#peer_id').addClass('hidden').val(peer_id);
        //         vm.peerHide=true;
        //         vm.peerId=peer_id;
        //         // $('#connected_peer_container').removeClass('hidden');
        //         vm.containerHide = false;
        //         // $('#connected_peer').text(connection.metadata.username);
        //         vm.connectedPeer = connection.metadata.username;
        //     });
        //
        //     peer.on('call', function(call){
        //         onReceiveCall(call);
        //     });
        //
        //
        //
        // }
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
       
       function login() {
           name = vm.name;
           peer_id = vm.peerId;
           if(peer_id){
               conn = peer.connect(peer_id, {metadata: {
                   'username': name
               }});
               conn.on('data', handleMessage);
           }

           vm.chatHide = false;
           vm.connectHide = true;
       }

        function sendMessage(){
            var text = $('#message').val();
            var data = {'from': name, 'text': text};

            conn.send(data);
            handleMessage(data);
            $('#message').val('');
        }
        
        function call() {
            console.log('now calling: ' + peer_id);
            console.log(peer);
            var call = peer.call(peer_id, window.localStream);
            call.on('stream', function(stream){
                window.peer_stream = stream;
                onReceiveStream(stream, 'peer-camera');
            });

        }



        function onReceiveCall(call) {
            call.answer(window.localStream);
            call.on('stream', function (stream) {
                window.peer_stream = stream;
                onReceiveStream(stream, 'peer-camera');
            });
        }
    }
})();