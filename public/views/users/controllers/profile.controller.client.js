(function () {
    angular
        .module("ProjectMaker")
        .controller("ProfileController", ProfileController);

    function ProfileController($routeParams, $location, UserService, RecruiterService) {
        var vm = this;

        // event handlers
        vm.interview = interview;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUsers;
        vm.sendInvitations = sendInvitations;
        vm.setDays = setDays;
        vm.setHours = setHours;
        vm.addTimeToList= addTimeToList;
        vm.newTimings= newTimings;
        vm.scheduleInterview = scheduleInterview;
        vm.addMail = addMail;
        vm.deleteMail = deleteMail;
        vm.deleteAllMail = deleteAllMail;
        vm.getCandidates = getCandidates;
        vm.deleteTiming= deleteTiming;
        vm.updateTimings= updateTimings;
        vm.createPosition = createPosition;
        vm.getPositions = getPositions;

        // Interviewer Start
        vm.initializeInterviewerUpcomingInterviews= initializeInterviewerUpcomingInterviews;
        vm.initializeViewCandidates= initializeViewCandidates;
        vm.initializeScheduleInterview = initializeScheduleInterview;

        vm.interview=null;
        // Interviewer End

        //Recruiter start
        vm.addPost = addPost;
        vm.deletePost = deletePost;
        vm.posts = [];
        vm.jobarray = [];
        //recruiter ends

        vm.emails = [];

        vm.weekend = false;
        var yyyy,dd,cMon,day;

        var months=['January','February','March','April','May','June','July','August','September','October','November','December'];

        vm.start=[];
        vm.end=[];
        vm.TimingList={};
        vm.timingDisplayList=[];



        // Interviewer
        vm.interviewerUpcomingInterviews = [{
            position: "Software Developer Internship - Summer 2018",
            recruiterName: "Tushar Gupta",
            location: "Narak",
            positionId: "12223we54"
        }, {
                position: "Software Developer Co-op - Fall 2018",
                recruiterName: "Tushar Gupta",
                location: "Narak",
                positionId: "12223we54"
        }, {
                position: "Software Developer  - Full Time",
                recruiterName: "Tushar Gupta",
                location: "Narak",
                positionId: "12223we54"
        }, {
                position: "Web Developer Internship - Summer 2018",
                recruiterName: "Tushar Gupta",
                location: "Narak",
                positionId: "12223we54"
        }];
        vm.interviewerPastInterviews=[{
            position: "Software Developer Internship - Summer 2018",
            recruiterName: "Tushar Gupta",
            location: "Narak",
            positionId: "12223we54"
        }, {
            position: "Software Developer Internship - Summer 2018",
            recruiterName: "Tushar Gupta",
            location: "Narak",
            positionId: "12223we54"
        }, {
            position: "Software Developer Internship - Summer 2018",
            recruiterName: "Tushar Gupta",
            location: "Narak",
            positionId: "12223we54"
        }, {
            position: "Software Developer Internship - Summer 2018",
            recruiterName: "Tushar Gupta",
            location: "Narak",
            positionId: "12223we54"
        }];


        // Inerviewer End




        function init() {
            vm.userId = $routeParams['uid'];
            var promise = UserService.findUserById(vm.userId);
            promise.success(
                function (user) {
                    vm.user = user;
                    vm.name = user.firstName + " " + user.lastName;
                });

            initializeCalender();
            // getCandidates();
            console.log(vm.TimingList);
            getPositions();
        }

        init();


        function addTimeToList() {
            var m;
            for(var u in months){
                if(months[u] == vm.month){
                    m=u;
                }
            }
            m=parseInt(m)+1;
            if(m<10){
                m='0'+m;
            }
            var dy;
            dy=vm.day;

            if(parseInt(vm.day) < 10){
                dy='0'+vm.day;
            }


            var fr= vm.from.split(" ")[0];
            var to= vm.to.split(" ")[0];
            console.log(yyyy+'-'+m+'-'+dy+'T'+fr+':00');
            console.log(new Date(yyyy+'-'+m+'-'+dy+'T'+fr+':00'));


            var startDate = new Date(yyyy+'-'+m+'-'+dy+'T'+fr+':00');
            var endDate = new Date(yyyy+'-'+m+'-'+dy+'T'+to+':00');
            var nowDate= new Date();

            // check for duplicate timings

            if(nowDate > startDate || nowDate > endDate){
                //error
            }
            else if(startDate >= endDate){
                //error
            }
            else{
                vm.start.push(startDate);
                vm.end.push(endDate);

                vm.timingDisplayList.push({
                    date: startDate.toISOString().slice(0,10),
                    start: ((startDate.getHours()+4)<10?'0':'') + (4 + startDate.getHours()) +  ' : ' + (startDate.getMinutes()<10?'0':'') + startDate.getMinutes(),
                    end: ((endDate.getHours()+4)<10?'0':'') + (4 + endDate.getHours()) +  ' : ' + (endDate.getMinutes()<10?'0':'') + endDate.getMinutes()
                });
            }

            if(vm.timingDisplayList.length == 1){
                if(vm.submitButton){
                    vm.updateButton=false;
                    vm.submitButton= true;
                }

            }

        }



        function newTimings() {
            UserService.setAvailability($routeParams['uid'],{'start':vm.start,'end':vm.end}).success(function (data) {
                console.log(data);
            });
        }
        
        function updateTimings() {
            UserService.setAvailability($routeParams['uid'],{'start':vm.start,'end':vm.end}).success(function (data) {
                console.log(data);
            });
        }

        function initializeCalender() {
            var today = new Date();
            dd = today.getDate();
            var mm = today.getMonth(); //January is 0!
            var nm = (today.getMonth() + 1) % 12;
            day = today.getDay();
            vm.months=[months[mm],months[nm]];
            vm.month=months[mm];
            cMon=months[mm];
            yyyy = today.getFullYear();
            setDays();
            setHours();

            // get existing timings
            getExistingTimings();


        }

        function getExistingTimings() {
            UserService.getAvailability($routeParams['uid']).
                success(function (result) {
                console.log("existing");
                console.log(result);
                if(result.startTime.length == 0){
                    // button is create
                    vm.updateButton=true;
                    vm.submitButton= false;

                }
                else{
                    for(var d in result.startTime){
                        var st = new Date(result.startTime[d]);
                        var et = new Date(result.endTime[d]);
                        console.log("sdfsd");
                        vm.timingDisplayList.push({
                            date: st.toISOString().slice(0,10),
                            start: ((st.getHours()+4)<10?'0':'') + (4 + st.getHours()) +  ' : ' + (et.getMinutes()<10?'0':'') + et.getMinutes(),
                            end: ((et.getHours()+4)<10?'0':'') + (4 + et.getHours()) +  ' : ' + (et.getMinutes()<10?'0':'') + et.getMinutes()
                        });

                        console.log(vm.timingDisplayList);

                    }
                    vm.updateButton=false;
                    vm.submitButton= true;
                }
            }).error(function (err) {
                console.log(err);
            })
        }


        function getMonthLabel(month, year) {
            var m;
            for(var u in months){
                if(months[u] == month){
                    m=u;
                }
            }
            m=parseInt(m)+1;
            return new Date(year, m, 0).getDate();
        }


        function setDays(){

            vm.days = Array.apply(null, Array(getMonthLabel(vm.month, yyyy))).map(function (_, i) {
                return i + 1;
            });

            console.log(vm.month);
            console.log(cMon);
            console.log(vm.month === cMon);

            if(vm.month === cMon)
                vm.day=dd;
            else
                vm.day=1;

            console.log("ng-change works");
            setHours();
        }

        function setHours() {
            var m;
            for(var u in months){
                if(months[u] == vm.month){
                    m=u;
                }
            }
            m=parseInt(m)+1;
            strDate = new Date(m+'/'+vm.day+'/'+yyyy);
            var d = strDate.getDay();
            if(d == 0 || d == 6){
               vm.weekend=true;
            }
            else{
                var hours = ['08:00 hrs','08:30 hrs','09:00 hrs','09:30 hrs','10:00 hrs','10:30 hrs','11:00 hrs','11:30 hrs','12:00 hrs','12:30 hrs','13:00 hrs','13:30 hrs','14:00 hrs','14:30 hrs','15:00 hrs','15:30 hrs','16:00 hrs','16:30 hrs','17:00 hrs','17:30 hrs','18:00 hrs']
                vm.hours = hours;
                vm.from=hours[0];
                vm.to=hours[1];
                vm.weekend=false
            }
        }


        function deleteTiming(timing) {
            var index = vm.timingDisplayList.indexOf(timing);

            if (index > -1) {
               vm.timingDisplayList.splice(index, 1);
            }

            if (vm.timingDisplayList.length == 0){
                vm.updateButton=true;
                vm.submitButton= true;
            }
        }

        function updateUser(newUser) {
            UserService
                .updateUser(vm.userId, newUser)
                .success(function (user) {
                    if (user != null) {
                        vm.message = "User Successfully Updated!";
                        init();
                    } else {
                        vm.error = "Unable to update user";
                    }
                });
        }

        function deleteUsers() {
            var user = UserService.deleteUser(vm.userId);
            if (user != null) {
                vm.message = "User Successfully Deleted!"
            } else {
                vm.error = "Unable to delete user!";
            }
        }

        function validateEmail(email) {
            var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            return re.test(email);
        }

        function addMail() {
            var lister = vm.newmail.split(/(?:,| )+/);
            console.log(lister);
            for (eachmail in lister) {
                console.log(lister[eachmail]);
                if (validateEmail(lister[eachmail])) {
                    vm.emails.push(lister[eachmail]);
                    console.log("added");
                }
            }
            vm.newmail = "";
        }

        function deleteAllMail() {
            vm.emails = [];
        }

        function deleteMail(listmail) {
            var index = vm.emails.indexOf(listmail);
            if (index > -1) {
                vm.emails.splice(index, 1);
            }
        }

        function sendInvitations() {
            // var emailer = ['mht.amul@gmail.com', 'rohansapre@yahoo.com', 'tushar.gupta.cse@gmail.com'];
            console.log("send invites");
            console.log(vm.emails);
            RecruiterService.sendInvitations(vm.emails)
                .success(function (status) {
                    if (status) {
                        console.log("Invitation sent from controller");
                        console.log(status);
                    } else
                        console.log("Cannot send invitation from controller");
                });
        }

        function interview() {
                $location.url("/user/" + vm.user._id + "/interview/");
        }

        function scheduleInterview(user) {
            console.log("scheduling interview " + user._applicant._id);
            var hire = {
                _recruiter: vm.userId,
                position: user.position
            };
            RecruiterService.scheduleInterview(user._applicant._id, hire);
        }

        function getCandidates() {
            console.log("inside profile.controller.client.js");
            RecruiterService.getCandidates(vm.userId)
                .success(function (info) {
                    vm.candidates = info;
                });
        }


        // Interviewer :


        function initializeInterviewerUpcomingInterviews(){
                //get upcoming interviews from intercview services
        }
        
        
        function initializeViewCandidates() {
            console.log("sgsgsgs");
            console.log(vm.tab);
            vm.interviewApplicants =[{
                name: 'Amul Mehta',
            },{
              name: 'Tushar Gupta'
            },{
                name: 'Rohan Sapre'
            },{
                name: 'Vaibhav Shukla'
            }];
        }
        
        function initializeScheduleInterview() {
            result= {
                startTime: [new Date(), new Date(), new Date(), new Date(), new Date()],
                endTime: [new Date(),new Date(), new Date(), new Date(), new Date()]
            };
            vm.applicantTiming=[];
            for(var d in result.startTime){
                var st = new Date(result.startTime[d]);
                var et = new Date(result.endTime[d]);
                console.log("sdfsd");
                vm.applicantTiming.push({
                    date: st.toISOString().slice(0,10),
                    start: ((st.getHours()+4)<10?'0':'') + (4 + st.getHours()) +  ' : ' + (et.getMinutes()<10?'0':'') + et.getMinutes(),
                    end: ((et.getHours()+4)<10?'0':'') + (4 + et.getHours()) +  ' : ' + (et.getMinutes()<10?'0':'') + et.getMinutes()
                });

            }
        }

        // Interviewer ENDS

        // Recruiter Starts
        function addPost() {
            console.log('in profile controller addPost');
            console.log(vm.newpost.title);
            vm.posts.push([vm.newpost.title, vm.newpost.location]);
            console.log(vm.posts);
            vm.newpost.title = "";
            vm.newpost.location = "";
        }

        function deletePost(post) {
            console.log('in profile controller deletePost');
            console.log(post);
            var index = vm.posts.indexOf(post);
            console.log(index);
            if (index > -1) {
                vm.posts.splice(index, 1);
            }
        }

        function addCandidate() {
            console.log('in profile controller addCandidate');
        }

        // Recruiter Ends

        function getPositions() {
            RecruiterService.getPositions(vm.userId)
                .success(function (positions) {
                    vm.positions = positions;
                })
                .error(function (error) {
                    console.log(error);
                })
        }

        function createPosition(position) {
            var newPosition = {
                name: position.name,
                location: position.location
            };
            RecruiterService.createPosition(vm.userId, newPosition)
                .success(function (position) {
                    console.log("position: " + position);
                })
        }

    }
})();