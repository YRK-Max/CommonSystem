package com.ruoyi.system.service;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public interface ISysSqlService {
    List<Map<?, ?>> executeSql(Map<String, String> map);
    Map<?, ?> executePageSql(Map<String, String> map);
    String getSQLStr(Map map);
    void insertLayoutInfo(Map map, String now);
    byte[] getReportFile(String report_path) throws IOException;
    int insertSQLStr(Map map);
    int updateSQLStr(Map map);
}
