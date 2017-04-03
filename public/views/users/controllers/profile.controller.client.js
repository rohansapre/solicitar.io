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

        vm.weekend = false;
        var yyyy,dd,cMon,day;

        var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
        vm.start=[];
        vm.end=[];
        vm.TimingList={};
        

        function init() {
            vm.userId = $routeParams['uid'];
            var promise = UserService.findUserById(vm.userId);
            promise.success(
                function (user) {
                    vm.user = user;
                    vm.name = user.firstName + " " + user.lastName;
                });

            initializeCalender();


            console.log(vm.TimingList);

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



            vm.start.push(new Date(yyyy+'-'+m+'-'+dy+'T'+fr+':00'));
            vm.end.push(new Date(yyyy+'-'+m+'-'+dy+'T'+to+':00'));


        }



        function newTimings() {
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

        function sendInvitations() {
            var emails = ['mht.amul@gmail.com', 'chaitanyakaul2001@gmail.com', 'tushar.gupta.cse@gmail.com', 'bharatnvarun@gmail.com', 'malkanimonica@gmail.com'];
            console.log("send invites");
            RecruiterService.sendInvitations(emails)
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
    }
})();