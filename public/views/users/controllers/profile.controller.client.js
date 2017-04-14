(function () {
    angular
        .module("ProjectMaker")
        .controller("ProfileController", ProfileController);

    function ProfileController($routeParams, $location, $rootScope, UserService, RecruiterService, InterviewService) {
        var vm = this;

        // event handlers
        vm.startInterview = startInterview;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUsers;
        vm.sendInvitations = sendInvitations;
        vm.setDays = setDays;
        vm.setHours = setHours;
        vm.addTimeToList = addTimeToList;
        vm.newTimings = newTimings;
        vm.updateInterviewTime = updateInterviewTime;
        vm.addMail = addMail;
        vm.deleteMail = deleteMail;
        vm.deleteAllMail = deleteAllMail;
        vm.getCandidates = getCandidates;
        vm.deleteTiming = deleteTiming;
        vm.updateTimings = updateTimings;
        vm.createPosition = createPosition;
        vm.getPositions = getPositions;
        vm.deletePosition = deletePosition;
        vm.logout = logout;

        // Interviewer Start
        vm.initializeInterviewerUpcomingInterviews = initializeInterviewerUpcomingInterviews;
        vm.initializeViewCandidates = initializeViewCandidates;
        vm.scheduleInterviewOnClick = scheduleInterviewOnClick;
        vm.interviewerScheduleInterview = interviewerScheduleInterview;
        vm.interviewerGetCandidateProfile = interviewerGetCandidateProfile;
        vm.initializeInterviewerPastInterviewsCandidates = initializeInterviewerPastInterviewsCandidates;
        vm.initializeInterviewerDashboard = initializeInterviewerDashboard;
        vm.initializeInterviewerProfile = initializeInterviewerProfile;
        vm.initializeInterviewerPast = initializeInterviewerPast;
        vm.initializeInterviewerSchedule = initializeInterviewerSchedule;
        vm.toStartInterview = toStartInterview;


        vm.interview = null;
        // Interviewer End

        //Recruiter start
        vm.initializeRecruiterViewcandidates = initializeRecruiterViewcandidates;
        vm.initializeRecruiterPositions = initializeRecruiterPositions;
        vm.addInterviewer = addInterviewer;
        vm.getInterviewers = getInterviewers;
        vm.assignInterviewer= assignInterviewer;
        vm.deleteCandidate = deleteCandidate;
        vm.initializeRecruiterProfile=initializeRecruiterProfile;
        vm.initializeRecruiterDashboard=initializeRecruiterDashboard;


        vm.posts = [];
        vm.jobarray = [];
        vm.interviewerarray = [];
        //recruiter ends

        vm.emails = [];

        vm.weekend = false;
        var yyyy, dd, cMon, day;

        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        vm.start = [];
        vm.end = [];
        vm.TimingList = {};
        vm.timingDisplayList = [];

        // Applicant

        vm.applicantDashboard = applicantDashboard;
        vm.applicantProfile = applicantProfile;
        vm.applicantUpcoming = applicantUpcoming;
        vm.applicantPast = applicantPast;
        vm.applicantSchedule = applicantSchedule;
        // Inerviewer End


        function init() {
            vm.user = $rootScope.currentUser;
            vm.userId = vm.user._id;
            vm.name = vm.user.firstName + " " + vm.user.lastName;
            console.log(vm.user);
            console.log(vm.userId);
            console.log(vm.name);
        }

        init();

        function addTimeToList() {
            var m;
            for (var u in months) {
                if (months[u] == vm.month) {
                    m = u;
                }
            }
            m = parseInt(m) + 1;
            if (m < 10) {
                m = '0' + m;
            }
            var dy;
            dy = vm.day;

            if (parseInt(vm.day) < 10) {
                dy = '0' + vm.day;
            }


            var fr = vm.from.split(" ")[0];
            var to = vm.to.split(" ")[0];
            console.log(yyyy + '-' + m + '-' + dy + 'T' + fr + ':00');
            console.log(new Date(yyyy + '-' + m + '-' + dy + 'T' + fr + ':00'));

            var startDate = new Date(yyyy + '-' + m + '-' + dy + 'T' + fr + ':00');
            var endDate = new Date(yyyy + '-' + m + '-' + dy + 'T' + to + ':00');
            var nowDate = new Date();

            // check for duplicate timings

            if (nowDate > startDate || nowDate > endDate) {
                vm.applicantMessage=null;
                vm.applicantError= "Invalid Time, please try again";
                //error
            }
            else if (startDate >= endDate) {
                vm.applicantMessage=null;
                vm.applicantError= "Invalid Time, please try again";
                //error
            }
            else {
                vm.applicantMessage=null;
                vm.applicantError=null;
                vm.start.push(startDate);
                vm.end.push(endDate);

                vm.timingDisplayList.push({
                    date: startDate.toUTCString().slice(0, 11),
                    start: ((startDate.getUTCHours()) < 10 ? '0' : '') + (startDate.getUTCHours()) + ' : ' + (startDate.getUTCMinutes() < 10 ? '0' : '') + startDate.getUTCMinutes(),
                    end: ((endDate.getUTCHours()) < 10 ? '0' : '') + (endDate.getUTCHours()) + ' : ' + (endDate.getUTCMinutes() < 10 ? '0' : '') + endDate.getUTCMinutes()
                });
            }

            if (vm.timingDisplayList.length == 1) {
                if (vm.submitButton) {
                    vm.updateButton = false;
                    vm.submitButton = true;
                }

            }

        }


        function newTimings() {
            UserService.setAvailability(vm.userId, {
                'start': vm.start,
                'end': vm.end
            }).success(function (data) {
                vm.applicantError=null;
                vm.applicantMessage="Success! Your interviewer will be notified of your availability!";
                console.log(data);
            });
        }

        function updateTimings() {
            UserService.updateAvailability(vm.userId, {
                'start': vm.start,
                'end': vm.end
            }).success(function (data) {
                vm.applicantError=null;
                vm.applicantMessage="Success! Your interviewer will be notified of your updated availability!";

                console.log(data);

            });
        }

        function initializeCalender() {
            var today = new Date();
            dd = today.getDate();
            var mm = today.getMonth(); //January is 0!
            var nm = (today.getMonth() + 1) % 12;
            day = today.getDay();
            vm.months = [months[mm], months[nm]];
            vm.month = months[mm];
            cMon = months[mm];
            yyyy = today.getFullYear();
            setDays();
            setHours();
            vm.applicantMessage=null;
            vm.applicantError=null;
            // get existing timings
            getExistingTimings();


        }

        function getExistingTimings() {
            UserService.getAvailability(vm.userId).success(function (result) {
                console.log("existing");
                console.log(result);

                if (result == null) {
                    // button is created

                    // ng-hide variables
                    vm.updateButton = true;
                    vm.submitButton = false;

                }
                else {
                    vm.timingDisplayList=[];
                    for (var d in result.startTime) {
                        var st = new Date(result.startTime[d]);
                        var et = new Date(result.endTime[d]);
                        console.log(st.toUTCString());
                        console.log(et.toUTCString());
                        vm.timingDisplayList.push({
                            date: st.toUTCString().slice(0, 11),
                            start: ((st.getUTCHours()) < 10 ? '0' : '') + (st.getUTCHours()) + ' : ' + (et.getUTCMinutes() < 10 ? '0' : '') + et.getUTCMinutes(),
                            end: ((et.getUTCHours()) < 10 ? '0' : '') + (et.getUTCHours()) + ' : ' + (et.getUTCMinutes() < 10 ? '0' : '') + et.getUTCMinutes()
                        });

                        console.log(vm.timingDisplayList);

                    }
                    vm.updateButton = false;
                    vm.submitButton = true;
                }
            }).error(function (err) {
                console.log(err);
            })
        }


        function getMonthLabel(month, year) {
            var m;
            for (var u in months) {
                if (months[u] == month) {
                    m = u;
                }
            }
            m = parseInt(m) + 1;
            return new Date(year, m, 0).getDate();
        }


        function setDays() {

            vm.days = Array.apply(null, Array(getMonthLabel(vm.month, yyyy))).map(function (_, i) {
                return i + 1;
            });

            console.log(vm.month);
            console.log(cMon);
            console.log(vm.month === cMon);

            if (vm.month === cMon)
                vm.day = dd;
            else
                vm.day = 1;

            console.log("ng-change works");
            setHours();
        }

        function setHours() {
            var m;
            for (var u in months) {
                if (months[u] == vm.month) {
                    m = u;
                }
            }
            m = parseInt(m) + 1;
            strDate = new Date(m + '/' + vm.day + '/' + yyyy);
            var d = strDate.getDay();
            if (d == 0 || d == 6) {
                vm.weekend = true;
            }
            else {
                var hours = ['08:00 hrs', '08:30 hrs', '09:00 hrs', '09:30 hrs', '10:00 hrs', '10:30 hrs', '11:00 hrs', '11:30 hrs', '12:00 hrs', '12:30 hrs', '13:00 hrs', '13:30 hrs', '14:00 hrs', '14:30 hrs', '15:00 hrs', '15:30 hrs', '16:00 hrs', '16:30 hrs', '17:00 hrs', '17:30 hrs', '18:00 hrs']
                vm.hours = hours;
                vm.from = hours[0];
                vm.to = hours[1];
                vm.weekend = false
            }
        }


        function deleteTiming(timing) {
            var index = vm.timingDisplayList.indexOf(timing);

            if (index > -1) {
                vm.timingDisplayList.splice(index, 1);
                vm.start.splice(index,1);
                vm.end.splice(index,1);

            }
            console.log(vm.start.length);

            if (vm.timingDisplayList.length == 0) {
                vm.updateButton = true;
                vm.submitButton = true;
            }
        }

        function updateUser(newUser) {
            console.log("update user profile");
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
                vm.message = "User Successfully Deleted!";
                $location.url("/");
            } else {
                vm.error = "Unable to delete user!";
            }
        }

        // function validateEmail(email) {
        //     var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        //     return re.test(email);
        // }

        function addMail() {
            var recruiterCreateUser = {
                email: vm.newUser.email,
                firstName: vm.newUser.firstName,
                lastName: vm.newUser.lastName
            };
            vm.emails.push(recruiterCreateUser);
            console.log("added");
            vm.newUser.firstName = "";
            vm.newUser.lastName = "";
            vm.newUser.email = "";
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
            // console.log(vm.emails);
            RecruiterService.sendInvitations(vm.positionId, vm.emails)
                .success(function (status) {
                    if (status) {
                        console.log("Invitation sent from controller");
                        console.log(status);
                        getCandidates(vm.positionId);
                    } else {
                        console.log("Cannot send invitation from controller");
                        getCandidates(vm.positionId);
                    }
                })
                .error(function (error) {
                    console.log("error");
                    console.log(error);
                });
            vm.emails = [];
        }

        function startInterview() {
            $location.url("/user/" + vm.user._id + "/interview/");
        }


        // function getCandidates() {
        //     console.log("inside profile.controller.client.js");
        //     RecruiterService.getCandidates(vm.userId)
        //         .success(function (info) {
        //             vm.candidates = info;
        //         });
        // }


        //------------------------------------------------------------------
        // Interviewer :

        // Helper Functions
        function updateInterviewTime(interviewId, startDate, endDate) {
            var time = {
                start: startDate,
                end: endDate
            };
            InterviewService.updateInterviewTime(interviewId, time)
                .success(function (s) {
                    vm.scheduleMessage = 'Interview is Scheduled Successfully!';
                })
                .error(function (error) {
                    console.log(error);
                });
        }


        function populateCandidateTimeSlots() {

            UserService.getAvailability(vm.applicantId)

                .success(function (result) {
                    // result = {
                    //     startTime: [new Date(), new Date(), new Date(), new Date(), new Date()],
                    //     endTime: [new Date(), new Date(), new Date(), new Date(), new Date()]
                    // };
                    vm.applicantTiming = [];
                    for (var d in result.startTime) {
                        var st = new Date(result.startTime[d]);
                        var et = new Date(result.endTime[d]);
                        console.log("sdfsd");
                        vm.applicantTiming.push({
                            date: st.toISOString().slice(0, 10),
                            start: ((st.getHours()) < 10 ? '0' : '') + (st.getHours()) + ' : ' + (et.getMinutes() < 10 ? '0' : '') + et.getMinutes(),
                            end: ((et.getHours()) < 10 ? '0' : '') + ( et.getHours()) + ' : ' + (et.getMinutes() < 10 ? '0' : '') + et.getMinutes()
                        });

                    }
                    var dateArray = [];
                    for (var r in result.startTime) {
                        var st = new Date(result.startTime[r]);
                        var date = st.toISOString().slice(0, 10);
                        if (!(dateArray.indexOf(date) > -1)) {
                            console.log(date);
                            console.log(dateArray);
                            dateArray.push(date);
                        }

                    }
                    vm.scheduleDate = dateArray[0];
                    vm.scheduleDates = dateArray;
                })

                .error(function (error) {
                    console.log(error);
                });
        }

        function toStartInterview(interview) {
            var interviewDate = interview.start;
            var currDate = new Date.now();

            var diff = interviewDate - currDate;
            var hh = Math.floor(diff / 1000 / 60 / 60);

            if (hh < 1) {
                return false;
            }
            return true;
        }


        function changeBackgorund(id) {
            $('li').removeClass('active');
            $('#' + id).addClass('active');
        }


        //-----------------------------------------------------------------

        // Dashboard
        function initializeInterviewerDashboard() {
            // Get latest interview
            changeBackgorund('interviewerDashboard');
            getNextInterviewForInterviewer();
        }

        function getNextInterviewForInterviewer() {
            InterviewService.getNextInterviewForInterviewer(vm.userId)
                .success(function (interview) {
                    console.log(interview);
                    vm.nextInterviewForInterviewer=interview;
                })
                .error(function (error) {
                    console.log("error");
                    console.log(error);
                })
        }

        //-----------------------------------------------------------------


        // Profile
        function initializeInterviewerProfile() {
            changeBackgorund('interviewerProfile');
        }

        //-----------------------------------------------------------------


        //Upcoming Interview Page
        function initializeInterviewerUpcomingInterviews() {
            changeBackgorund('interviewerUpcoming');
            //get upcoming interviews from interview services
            InterviewService.getUpcomingInterviewPositions(vm.userId)
                .success(function (positions) {
                    console.log("positions: ");
                    console.log(positions);
                    vm.interviewerUpcomingInterviews = positions;
                    if (positions.length == 0) {
                        vm.emptyUpcomingInterviews = true;
                    } else {
                        vm.emptyUpcomingInterviews = false;
                    }
                })
                .error(function (error) {
                    console.log("error");
                    console.log(error);
                });
        }

        // Upcoming Interview -> View Candidates
        function initializeViewCandidates() {

            var positionId= vm.interviewInstance;
            console.log("sgsgsgs");
            console.log(vm.interviewInstance);
            console.log(vm.tab);
            console.log(positionId);
            InterviewService.getCandidatesForUpcomingPositions(vm.userId, positionId)
                .success(function (candidates) {
                    console.log("got candidates");
                    console.log(candidates);
                    vm.interviewApplicants = candidates;
                    if (candidates.length == 0) {
                        vm.emptyUpcomingCandidates = true;
                    }
                    else {
                        vm.emptyUpcomingCandidates = false;
                    }

                })
        }


        // Upcoming Interview -> View Candidates -> View Candidate Profile
        function interviewerGetCandidateProfile() {
            var promise = UserService.findUserById(vm.applicantId);
            promise.success(
                function (applicant) {
                    vm.applicant = applicant;
                    vm.applicantName = applicant.firstName + " " + applicant.lastName;
                });
        }


        // Upcoming Interview -> View Candidates -> Schedule Interview
        function interviewerScheduleInterview() {
            populateCandidateTimeSlots();
        }

        function scheduleInterviewOnClick() {
            var from = vm.scheduleFrom.split(':');
            var to = vm.scheduleTo.split(':');
            var dateArr = vm.scheduleDate.split('-');
            from = new Date(dateArr[0], parseInt(dateArr[1]) - 1, dateArr[2], from[0], from[1]);
            to = new Date(dateArr[0], parseInt(dateArr[1]) - 1, dateArr[2], to[0], to[1]);
            var success = false;
            for (var d in result.startTime) {
                var st = result.startTime[d];
                var et = result.endTime[d];
                et.setSeconds(0);
                st.setSeconds(0);
                console.log(from.setSeconds(10));
                console.log(st);

                console.log((from <= st));
                console.log((to <= et));
                if ((from >= st) && (to <= et)) {
                    success = true;
                    break;
                }

            }

            if (success) {
                console.log("Yo");
                updateInterviewTime(vm.interviewInstance._id, from, to);
            }

            else {
                console.log("ERROR");
                vm.scheduleError = 'Invalid Date/Time. Please try again';
            }

        }

        //-----------------------------------------------------------------


        // Past Interviews
        function initializeInterviewerPast() {
            changeBackgorund('interviewerPast');
            InterviewService.getPastInterviewPositions(vm.userId)
                .success(function (positions) {
                    console.log("positions: ");
                    console.log(positions);
                    vm.interviewerPastInterviews = positions;
                    if (positions.length == 0) {
                        vm.emptyPastInterviews = true;
                    }
                    else {
                        vm.emptyPastInterviews = false;
                    }
                })
                .error(function (error) {
                    console.log("error");
                    console.log(error);
                });
        }

        // Past Interviews -> View Candidates
        function initializeInterviewerPastInterviewsCandidates() {
            InterviewService.getCandidatesForPastPositions(vm.pastInterview._id, vm.userId)
                .success(function (candidates) {
                    console.log("candidates: ");
                    console.log(candidates);
                    vm.pastCandidates = candidates;
                    if (candidates.length == 0)
                        vm.emptyPastCandidates = true;
                    else
                        vm.emptyPastCandidates = false;

                })
                .error(function (error) {
                    console.log("error");
                    console.log(error);
                });
        }

        //-----------------------------------------------------------------


        // My Schedule
        function initializeInterviewerSchedule() {
            changeBackgorund('interviewerSchedule');
            InterviewService.getInterviewerSchedule(vm.userId)
                .success(function (schedule) {
                    console.log("My Schedule");
                    console.log(schedule);
                    vm.mySchedule = schedule;
                    if (schedule.length == 0)
                        vm.emptySchedule = true;
                    else
                        vm.emptySchedule = false;

                })
                .error(function (error) {
                    console.log(error);
                })
        }


        //-----------------------------------------------------------------


        // Interviewer ENDS

        // Recruiter Starts

        //changebackground
        function initializeRecruiterDashboard() {
            changeBackgorund('recruiterdash');

        }

        // change background
        function initializeRecruiterProfile() {
            changeBackgorund('recruiterprofile');

        }

        function addPost() {
            console.log('in profile controller addPost');
            console.log(vm.newpost.title);
            vm.posts.push([vm.newpost.title, vm.newpost.location]);
            console.log(vm.posts);
            vm.newpost.title = "";
            vm.newpost.location = "";
            RecruiterService.create
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

        function addInterviewer(user) {
            console.log('in profile controller addInterviewer');
            if (user.password === user.passverify) {
                var userInterviewer = {
                    username: user.username,
                    password: user.password,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    type: 'INTERVIEWER',
                    organisation: vm.user.organisation,
                    status: 'JOINED'
                };
                RecruiterService.createInterviewer(vm.userId, userInterviewer)
                    .success(function (interviewer) {
                        console.log(interviewer);
                    }, function (error) {
                        console.log("error");
                        console.log(error);
                    })
            }
        }

        function getInterviewers() {
            RecruiterService.getInterviewers(vm.userId)
                .success(function (interviewers) {
                    console.log(interviewers);
                    vm.rawInterviewer= interviewers;
                    vm.interviewerarray=[];
                    for (var interviewer in interviewers){
                        var interviewerName = interviewers[interviewer]['_interviewer']['firstName'] + '  ' + interviewers[interviewer]['_interviewer']['lastName'];
                        vm.interviewerarray.push(interviewerName);

                    }
                })
                .error(function (error) {
                    console.log("error");
                    console.log(error);
                })
        }

        function deleteInterviewer(interviewerId) {
            RecruiterService.deleteInterviewer(interviewerId)
                .success(function (interviewer) {
                    console.log(interviewer);
                })
                .error(function (error) {
                    console.log("error");
                    console.log(error);
                })
        }

        // Recruiter Ends

        // Positions

        function getPositions() {
            RecruiterService.getPositions(vm.userId)
                .success(function (positions) {
                    vm.positions = positions;
                    vm.posLength = positions.length;
                    console.log('in getPositions');
                    console.log(vm.positions);
                })
                .error(function (error) {
                    console.log(error);
                })
        }

        function createPosition() {
            console.log(vm.newOpenPosition);
            var newPosition = {
                name: vm.newOpenPosition.name,
                location: vm.newOpenPosition.location
            };
            vm.newOpenPosition.name = "";
            vm.newOpenPosition.location = "";
            console.log(newPosition);
            RecruiterService.createPosition(vm.userId, newPosition)
                .success(function (position) {
                    console.log("position: ");
                    console.log(position);
                    getPositions();
                });

        }

        function deletePosition(positionId) {
            console.log("deleting from profile");
            RecruiterService.deletePosition(positionId)
                .success(function (position) {
                    getPositions();
                })
        }

        //----------------------------------------------------------------


        // Candidates

        function initializeRecruiterViewcandidates() {
            getCandidates(vm.positionId);
            getInterviewers();
        }


        // change background
        function initializeRecruiterPositions() {
            changeBackgorund('recruiterpostings');
            getPositions();
        }

        function getCandidates(positionId) {
            
            RecruiterService.getCandidates(positionId)
                .success(function (candidates) {
                    vm.candidatesByJob=candidates;
                    getScheduledInterviews(positionId);
                })
        }

        function dropdownTodo() {
            console.log("candidates are:");
            console.log(vm.finalData);
            vm.interviewerDropdown=[];
            vm.interviewerDetails=[];


            var candidates=vm.finalData;


            for(var c in candidates){
                console.log("in for loop")
                console.log(('undefined' === typeof candidates[c]._interviewer));
                if(('undefined' === typeof candidates[c]._interviewer)){
                    vm.interviewerDropdown[c]=false;
                    vm.interviewerDetails[c]="";
                }
                else{
                    vm.interviewerDropdown[c]=true;
                    vm.interviewerDetails[c]= candidates[c]._interviewer.firstName+ '  ' +candidates[c]._interviewer.lastName;
                    console.log("dsfsgsdg");
                    // console.log(candidates[c]._interviewer.firstName);
                    console.log(vm.interviewerDetails[c]);
                }
            }

        }

        function getScheduledInterviews(positionId) {
            RecruiterService.getScheduledInterviews(positionId)
                .success(function (interviews) {
                    var finalData = [];
                    console.log("candidates");
                    console.log(vm.candidatesByJob);
                    console.log("fdfgfwwwwwWWwwwwwwwwwwwww");
                    for (var c in vm.candidatesByJob) {
                        var match = false;
                        for (var i in interviews) {
                            if (vm.candidatesByJob[c]._applicant._id === interviews[i]._applicant) {
                                var temp = vm.candidatesByJob[c];
                                console.log(interviews[i]);
                                temp._interviewer = {
                                    _id: interviews[i]._interviewer._id,
                                    firstName: interviews[i]._interviewer.firstName,
                                    lastName: interviews[i]._interviewer.lastName
                                };
                                finalData.push(temp);
                                match = true;
                                break;
                            }
                        }
                        if(!match)
                            finalData.push(vm.candidatesByJob[c]);
                    }
                    console.log("fdfgfwwwwwWWwwwwwwwwwwwww");
                    console.log(finalData);
                    vm.finalData = finalData;
                    dropdownTodo();
                })
                .error(function (error) {
                    console.log("error");
                    console.log(error);
                })
        }

        function setInterviewer(candidates) {
            for (var i in candidates){
                console.log(candidates[i]);
            }
        }

        function getRawInterviewer(name) {
            for (var i in vm.rawInterviewer){
                var nm = vm.rawInterviewer[i]._interviewer.firstName+ '  ' +vm.rawInterviewer[i]._interviewer.lastName;
                if(nm == name)
                    return vm.rawInterviewer[i]._interviewer;
            }
        }

        function assignInterviewer(candidate,index) {
            console.log("1221`21212121212   assign Interviewer");
            console.log(vm.rawInterviewer[index]['_interviewer']);
            console.log(getRawInterviewer(vm.interviewerDetails[index]));
            console.log("12121212121212 assign Interviewer");
            var users = {
                _applicant: candidate._applicant._id,
                _interviewer: getRawInterviewer(vm.interviewerDetails[index]),
                _position: candidate._position
            };
            console.log(users);
            InterviewService.assignInterviewer(users)
                .success(function (interview) {
                    console.log("success");
                    console.log(interview)
                })
                .error(function (error) {
                    console.log("error");
                    console.log(error);
                })
        }

        function deleteCandidate(candidateId) {
            console.log("reached delete");
            console.log(candidateId);
            InterviewService.deleteCandidate(candidateId)
                .success(function (candidate) {
                    getCandidates(vm.positionId);
                })
                .error(function (error) {
                    console.log(error);
                })
        }

        // CANDIDATE ENDS

        //-------------------------------------------------------------------

        // APPLICANT STARTS

        function applicantDashboard() {
            changeBackgorund("applicantDashboard");
            getNextInterviewForApplicant();
        }

        function applicantProfile() {
            changeBackgorund("applicantProfile");
        }

        function applicantUpcoming() {
            changeBackgorund("applicantUpcomingInterviews");
            getUpcomingInterviewForApplicant(vm.userId);
        }

        function applicantPast() {
            changeBackgorund("applicantPastInterviews");
            getPastInterviewForApplicant(vm.userId);
        }

        function applicantSchedule() {
            changeBackgorund("applicantUpcomingInterviews");
            initializeCalender();

           }


        function getUpcomingInterviewForApplicant(userId) {
            console.log(userId);
            UserService.getUpcomingInterviews(userId)
                .success(function (interviews) {
                    console.log(interviews);
                    if (interviews.length == 0) {
                        vm.emptyUpcomingInterviews = true;
                    }
                    else {
                        vm.emptyUpcomingInterviews = false;
                        vm.applicantUpcomingInterviews = interviews;
                        console.log(vm.applicantUpcomingInterviews);
                    }
                })
                .error(function (error) {
                    console.log("error");
                    console.log(error);
                });
        }

        function getPastInterviewForApplicant(userId) {
            UserService.getPastInterviews(userId)
                .success(function (interviews) {
                    if (interviews.length == 0) {
                        vm.emptyPastInterviews = true;
                    }
                    else {
                        vm.emptyPastInterviews = false;
                        vm.applicantPreviousInterviews = interviews;
                    }
                })
                .error(function (error) {
                    console.log("error");
                    console.log(error);
                })
        }

        // function getInterviewerSchedule() {
        //     InterviewService.getInterviewerSchedule(vm.userId)
        //         .success(function (schedule) {
        //             console.log(schedule);
        //         })
        //         .error(function (error) {
        //             console.log("error");
        //             console.log(error);
        //         });
        // }

        function getNextInterviewForApplicant() {
            InterviewService.getNextInterviewForApplicant(vm.userId)
                .success(function (interview) {
                    console.log(interview);
                    vm.applicantNextInterview=interview;
                }, function (error) {
                    console.log("error");
                    console.log(error);
                })
        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $rootScope.currentUser = null;
                    $location.url("/");
                })
        }
    }
})();