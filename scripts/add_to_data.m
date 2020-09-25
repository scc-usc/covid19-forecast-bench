path = '../historical-data/';
forecast_date = datetime((now),'ConvertFrom','datenum', 'TimeZone', 'America/Los_Angeles');
forecast_date = datestr(forecast_date, 'yyyy-mm-dd');
dirname = datestr(forecast_date, 'yyyy-mm-dd');

fullpath = [path dirname '/'];

if ~exist(fullpath, 'dir')
    mkdir(fullpath);
end

src_address = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/';

fname = 'time_series_covid19_confirmed_US.csv';
urlwrite([src_address fname], [fullpath fname]);

fname = 'time_series_covid19_deaths_US.csv';
urlwrite([src_address fname], [fullpath fname]);

fname = 'time_series_covid19_confirmed_global.csv';
urlwrite([src_address fname], [fullpath fname]);

fname = 'time_series_covid19_deaths_global.csv';
urlwrite([src_address fname], [fullpath fname]);

display(['Files written in ' fullpath ]);
