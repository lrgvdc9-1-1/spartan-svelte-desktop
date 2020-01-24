  <script>
     import {onMount} from "svelte";
     
     import {Months,MonthsAbbre,FullWeekDays, CalendarPage} from '../../utils/Months';
     import WeekDays from "./WeekDays.svelte";
     import Week from "./Week.svelte";
     
    export let footer = false;
    let element;
    let today = new Date();
    let alwaysToday = new Date(2020, 1, 20);
    let moveUp = false;
    let choosen = null;
    let redrawing = false;
    let calendars = [];

    $: MonthTitle = Months[today.getMonth()];
    $: Todaylbl  = `${FullWeekDays[alwaysToday.getDay()]}, ${MonthsAbbre[alwaysToday.getMonth()]} ${alwaysToday.getDate()}`;

    onMount(() => {
         today = new Date(today.getFullYear(), today.getMonth(), 1);
         calendars =  getDaysInMonth(today, new Date(today.getFullYear(), today.getMonth(), daysInMonth(today.getMonth(), today.getFullYear())));
         redrawing = true;
         //console.table(calendars);
    });



    function getDaysInMonth(today, lastDay) {
        var date = new Date(today);
        var month = date.getMonth();
        var lastDay = new Date(lastDay); 
        var calendars = [[], [], [], [], [], []];
        var row = 0;
        if(date.getDay() > 0) {
            calendars[0] = getDaysBackwards(date, month);
            
        }
        while (row < 6) {

            if(calendars[row].length < 7) {
                
                calendars[row].push(new CalendarPage(new Date(date), month));
                var col = calendars[row].length - 1;
                if(col > -1)
                {calendars[row][col].checkChoosen(choosen);}
                date.setDate(date.getDate() + 1);
             }

             if(calendars[row].length == 7) {
                 row++;
             }  
        }
        return calendars;
   }


    function getDaysBackwards(date, month) {
        var today   = new Date(date);
        var number = date.getDay();
        var days = [];
        for(var x = 0; x < number; x++) {
            var cutDays = number - x;
            today.setDate(today.getDate() - cutDays);
            days.push(new CalendarPage(new Date(today), month));
            days[x].checkChoosen(choosen);
            today = new Date(date);            
        }
        
        return days;
    }


     function daysInMonth(iMonth, iYear) 
    { 
      return 32 - new Date(iYear, iMonth, 32).getDate();
    }

  </script>
  
  <div class=" calendar">
    <div class="calendar-header">
        <div class="header-year">{alwaysToday.getFullYear()}</div>
        <div class="header-day">{Todaylbl}</div>
        </div>
        <div class="calendar-content">
            <div class="calendar-toolbar">
                <span class="prev-month"><span class="default-icon-chevron-left"></span></span>
                <span class="curr-month">{MonthTitle}</span>
                <span class="next-month">
                    <span class="default-icon-chevron-right"></span>
                </span>
                <span class="prev-year"><span class="default-icon-chevron-left"></span></span>
                <span class="curr-year">2020</span>
                <span class="next-year">
                    <span class="default-icon-chevron-right"></span>
                </span>
            </div>
           <WeekDays />
            <div class="days">
                {#each calendars as days}
                     <Week days={days} />
                {/each}
 
            </div>
         </div>

                 {#if footer}
                     <div class="calendar-footer">
                        <!-- <button type="button" class="button cancel js-dialog-close">Cancel</button>
                            <button type="button" class="button today">Today</button><button type="button" class="button clear">Clear</button>
                            <button type="button" class="button done js-dialog-close">Done</button> -->
                    </div>
                 {/if}   
                    
                    
                    
                    <!-- <div class="calendar-months"><ul class="months-list"><li class="js-month-0">January</li><li class="js-month-1">February</li><li class="js-month-2">March</li><li class="js-month-3">April</li><li class="js-month-4">May</li><li class="js-month-5">June</li><li class="js-month-6">July</li><li class="js-month-7">August</li><li class="js-month-8">September</li><li class="js-month-9">October</li><li class="js-month-10">November</li><li class="js-month-11">December</li></ul></div><div class="calendar-years"><ul class="years-list"><li class="js-year-1920">1920</li><li class="js-year-1921">1921</li><li class="js-year-1922">1922</li><li class="js-year-1923">1923</li><li class="js-year-1924">1924</li><li class="js-year-1925">1925</li><li class="js-year-1926">1926</li><li class="js-year-1927">1927</li><li class="js-year-1928">1928</li><li class="js-year-1929">1929</li><li class="js-year-1930">1930</li><li class="js-year-1931">1931</li><li class="js-year-1932">1932</li><li class="js-year-1933">1933</li><li class="js-year-1934">1934</li><li class="js-year-1935">1935</li><li class="js-year-1936">1936</li><li class="js-year-1937">1937</li><li class="js-year-1938">1938</li><li class="js-year-1939">1939</li><li class="js-year-1940">1940</li><li class="js-year-1941">1941</li><li class="js-year-1942">1942</li><li class="js-year-1943">1943</li><li class="js-year-1944">1944</li><li class="js-year-1945">1945</li><li class="js-year-1946">1946</li><li class="js-year-1947">1947</li><li class="js-year-1948">1948</li><li class="js-year-1949">1949</li><li class="js-year-1950">1950</li><li class="js-year-1951">1951</li><li class="js-year-1952">1952</li><li class="js-year-1953">1953</li><li class="js-year-1954">1954</li><li class="js-year-1955">1955</li><li class="js-year-1956">1956</li><li class="js-year-1957">1957</li><li class="js-year-1958">1958</li><li class="js-year-1959">1959</li><li class="js-year-1960">1960</li><li class="js-year-1961">1961</li><li class="js-year-1962">1962</li><li class="js-year-1963">1963</li><li class="js-year-1964">1964</li><li class="js-year-1965">1965</li><li class="js-year-1966">1966</li><li class="js-year-1967">1967</li><li class="js-year-1968">1968</li><li class="js-year-1969">1969</li><li class="js-year-1970">1970</li><li class="js-year-1971">1971</li><li class="js-year-1972">1972</li><li class="js-year-1973">1973</li><li class="js-year-1974">1974</li><li class="js-year-1975">1975</li><li class="js-year-1976">1976</li><li class="js-year-1977">1977</li><li class="js-year-1978">1978</li><li class="js-year-1979">1979</li><li class="js-year-1980">1980</li><li class="js-year-1981">1981</li><li class="js-year-1982">1982</li><li class="js-year-1983">1983</li><li class="js-year-1984">1984</li><li class="js-year-1985">1985</li><li class="js-year-1986">1986</li><li class="js-year-1987">1987</li><li class="js-year-1988">1988</li><li class="js-year-1989">1989</li><li class="js-year-1990">1990</li><li class="js-year-1991">1991</li><li class="js-year-1992">1992</li><li class="js-year-1993">1993</li><li class="js-year-1994">1994</li><li class="js-year-1995">1995</li><li class="js-year-1996">1996</li><li class="js-year-1997">1997</li><li class="js-year-1998">1998</li><li class="js-year-1999">1999</li><li class="js-year-2000">2000</li><li class="js-year-2001">2001</li><li class="js-year-2002">2002</li><li class="js-year-2003">2003</li><li class="js-year-2004">2004</li><li class="js-year-2005">2005</li><li class="js-year-2006">2006</li><li class="js-year-2007">2007</li><li class="js-year-2008">2008</li><li class="js-year-2009">2009</li><li class="js-year-2010">2010</li><li class="js-year-2011">2011</li><li class="js-year-2012">2012</li><li class="js-year-2013">2013</li><li class="js-year-2014">2014</li><li class="js-year-2015">2015</li><li class="js-year-2016">2016</li><li class="js-year-2017">2017</li><li class="js-year-2018">2018</li><li class="js-year-2019">2019</li><li class="js-year-2020">2020</li><li class="js-year-2021">2021</li><li class="js-year-2022">2022</li><li class="js-year-2023">2023</li><li class="js-year-2024">2024</li><li class="js-year-2025">2025</li><li class="js-year-2026">2026</li><li class="js-year-2027">2027</li><li class="js-year-2028">2028</li><li class="js-year-2029">2029</li><li class="js-year-2030">2030</li><li class="js-year-2031">2031</li><li class="js-year-2032">2032</li><li class="js-year-2033">2033</li><li class="js-year-2034">2034</li><li class="js-year-2035">2035</li><li class="js-year-2036">2036</li><li class="js-year-2037">2037</li><li class="js-year-2038">2038</li><li class="js-year-2039">2039</li><li class="js-year-2040">2040</li><li class="js-year-2041">2041</li><li class="js-year-2042">2042</li><li class="js-year-2043">2043</li><li class="js-year-2044">2044</li><li class="js-year-2045">2045</li><li class="js-year-2046">2046</li><li class="js-year-2047">2047</li><li class="js-year-2048">2048</li><li class="js-year-2049">2049</li><li class="js-year-2050">2050</li><li class="js-year-2051">2051</li><li class="js-year-2052">2052</li><li class="js-year-2053">2053</li><li class="js-year-2054">2054</li><li class="js-year-2055">2055</li><li class="js-year-2056">2056</li><li class="js-year-2057">2057</li><li class="js-year-2058">2058</li><li class="js-year-2059">2059</li><li class="js-year-2060">2060</li><li class="js-year-2061">2061</li><li class="js-year-2062">2062</li><li class="js-year-2063">2063</li><li class="js-year-2064">2064</li><li class="js-year-2065">2065</li><li class="js-year-2066">2066</li><li class="js-year-2067">2067</li><li class="js-year-2068">2068</li><li class="js-year-2069">2069</li><li class="js-year-2070">2070</li><li class="js-year-2071">2071</li><li class="js-year-2072">2072</li><li class="js-year-2073">2073</li><li class="js-year-2074">2074</li><li class="js-year-2075">2075</li><li class="js-year-2076">2076</li><li class="js-year-2077">2077</li><li class="js-year-2078">2078</li><li class="js-year-2079">2079</li><li class="js-year-2080">2080</li><li class="js-year-2081">2081</li><li class="js-year-2082">2082</li><li class="js-year-2083">2083</li><li class="js-year-2084">2084</li><li class="js-year-2085">2085</li><li class="js-year-2086">2086</li><li class="js-year-2087">2087</li><li class="js-year-2088">2088</li><li class="js-year-2089">2089</li><li class="js-year-2090">2090</li><li class="js-year-2091">2091</li><li class="js-year-2092">2092</li><li class="js-year-2093">2093</li><li class="js-year-2094">2094</li><li class="js-year-2095">2095</li><li class="js-year-2096">2096</li><li class="js-year-2097">2097</li><li class="js-year-2098">2098</li><li class="js-year-2099">2099</li><li class="js-year-2100">2100</li><li class="js-year-2101">2101</li><li class="js-year-2102">2102</li><li class="js-year-2103">2103</li><li class="js-year-2104">2104</li><li class="js-year-2105">2105</li><li class="js-year-2106">2106</li><li class="js-year-2107">2107</li><li class="js-year-2108">2108</li><li class="js-year-2109">2109</li><li class="js-year-2110">2110</li><li class="js-year-2111">2111</li><li class="js-year-2112">2112</li><li class="js-year-2113">2113</li><li class="js-year-2114">2114</li><li class="js-year-2115">2115</li><li class="js-year-2116">2116</li><li class="js-year-2117">2117</li><li class="js-year-2118">2118</li><li class="js-year-2119">2119</li><li class="js-year-2120">2120</li></ul></div></div>
             -->
</div>
