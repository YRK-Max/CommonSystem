package com.ruoyi.system.service.impl;

import com.ruoyi.system.mapper.SysSqlMapper;
import com.ruoyi.system.service.ISysSqlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class SysSqlService implements ISysSqlService {
    @Autowired
    SysSqlMapper commonReportMapper;

    @Value("${path.layout}")
    private String FilePath;

    /**
     * 参数校验
     *
     * @param str ep: "or 1=1"
     */
    public boolean isSqlValid(String str) {
        String reg = "(?:--)|(/\\*(?:.|[\\n\\r])*?\\*/)|"
                + "(\\b(update|delete|insert|trancate|char|into|ascii|declare|exec|master|into|drop|execute)\\b)";
        Pattern sqlPattern = Pattern.compile(reg, Pattern.CASE_INSENSITIVE);//表示忽略大小写
        Matcher matcher = sqlPattern.matcher(str);
        if (matcher.find()) {
            System.out.println("参数存在非法字符，请确认："+matcher.group());//获取非法字符：or
            return false;
        }
        return true;
    }

    @Override
    public List<Map<?, ?>> executeSql(Map<String, String> map) {
        String sql_name = map.get("sql_name");

        if (sql_name.equals("")) {
            List<Map<?, ?>> result_error = new ArrayList<>();
            Map<String, String> map_error = new HashMap<>();
            map_error.put("error", "sql语句语法有问题，请检查");
            result_error.add(map_error);
            return result_error;
        }

        String sqlStr = commonReportMapper.getSqlStr(map);

        for (Map.Entry<String, String> mapEntry : map.entrySet()) {
            String sql_temp = "";
            if (mapEntry.getKey().contains("Number")) {
                sql_temp = sqlStr.replace("#{" + mapEntry.getKey() + "}", mapEntry.getValue().equals("") ? "NULL" : mapEntry.getValue());
            } else {
                sql_temp = sqlStr.replace("#{" + mapEntry.getKey() + "}", mapEntry.getValue().equals("") ? "NULL" : "'" + mapEntry.getValue() + "'");
            }
            sqlStr = sql_temp;
        }

        if (isSqlValid(sqlStr)) {
            map.put("sqlStr", sqlStr);
            return commonReportMapper.executeSql(map);
        } else {
            return null;
        }
    }

    /**
     * 执行分页 sql
     * **/
    @Override
    public Map<?, ?> executePageSql(Map<String, String> map) {
        Map<String, Object> result = new HashMap<>();
        String sql_name = map.get("sql_name");
        String firstQuery = map.get("firstQuery");

        if (sql_name.equals("")) {
            Map<String, String> result_error = new HashMap<>();
            result_error.put("error", "sql语句语法有问题，请检查");
            return result_error;
        }

        String sqlStr = commonReportMapper.getSqlStr(map);

        for(Map.Entry<String, String> mapEntry : map.entrySet()) {
            String sql_temp = "";
            if(mapEntry.getKey().contains("Number")){
                sql_temp = sqlStr.replace("#{" + mapEntry.getKey() + "}", mapEntry.getValue().equals("") ? "NULL" : mapEntry.getValue());
            }else {
                sql_temp = sqlStr.replace("#{" + mapEntry.getKey() + "}", mapEntry.getValue().equals("") ? "NULL" : "'" + mapEntry.getValue() + "'");
            }
            sqlStr = sql_temp;
        };

        map.put("sqlStr", sqlStr);
        if(firstQuery.equals("Y")) {
            int rowNum = commonReportMapper.getRowNumOfSql(map);
            result.put("total", rowNum);
        }
        map.put("sqlStr", sqlStr + " Limit " + map.get("skipNumber") + "," + map.get("maxCountNumber"));
        List<Map<?, ?>> records = commonReportMapper.executeSql(map);
        result.put("items", records);
        return result;
    }

    @Override
    public String getSQLStr(Map map) {
        return commonReportMapper.getSqlStr(map);
    }

    @Override
    public void insertLayoutInfo(Map map, String now) {
        String layout_name = map.get("layout_name").toString();
        ((List<Map>)map.get("items")).forEach(r -> {
            r.forEach((k,v) -> {
                if(v == null){
                    r.put(k, "");
                }
            });
            r.put("belong", layout_name);
            r.put("timekey", now);
            commonReportMapper.insertLayoutItem(r);
        });
    }

    @Override
    public byte[] getReportFile(String report_path) throws IOException {
        File file = new File(report_path);
        if(!file.exists()) {
            return null;
        }
        byte[] buffer = new byte[(int) file.length()];
        int offset = 0;
        int numRead = 0;
        FileInputStream fi = new FileInputStream(file);
        while (offset < buffer.length
                && (numRead = fi.read(buffer, offset, buffer.length - offset)) >= 0) {
            offset += numRead;
        }
        // 确保所有数据均被读取
        if (offset != buffer.length) {
            throw new IOException("Could not completely read file "
                    + file.getName());
        }
        fi.close();
        return buffer;
    }

    @Override
    public int insertSQLStr(Map map) {
        if(isSqlValid(map.get("sql_str").toString())) {
            return commonReportMapper.insertSQLStr(map);
        }
        return 0;
    }

    @Override
    public int updateSQLStr(Map map) {
        if(isSqlValid(map.get("sql_str").toString())) {
            return commonReportMapper.updateSQLStr(map);
        }
        return 0;
    }

    @Override
    public String readLayoutFile(String layout_name) throws IOException {

        String s = "";
        File file = new File(FilePath + "\\layout_" + layout_name + ".txt");
        if(!file.exists()) {
            return "Error";
        }
        InputStreamReader in = new InputStreamReader(new FileInputStream(file),"UTF-8");
        BufferedReader br = new BufferedReader(in);
        StringBuilder content = new StringBuilder();
        while ((s=br.readLine())!=null){
            content.append(s);
        }
        return content.toString();
    }
}
