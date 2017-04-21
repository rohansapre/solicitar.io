/**
 * Created by rohansapre on 4/18/17.
 */
(function () {
    angular
        .module("ProjectMaker")
        .directive('embedSrc', embedDirective);
    function embedDirective () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(
                    function () {
                        return attrs.embedSrc;
                    },
                    function () {
                        element.attr('src', attrs.embedSrc);
                    }
                );
            }
        }
}})();

