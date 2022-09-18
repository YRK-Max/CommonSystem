package com.ruoyi.system.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface SysSqlMapper {
    List<Map<?, ?>> executeSql(Map<String, String> map);

    int getRowNumOfSql(Map<String, String> map);

    String getSqlStr(Map<String, String> map);

    int insertSQLStr(Map<String, String> map);

    int updateSQLStr(Map<String, String> map);

    Integer insertLayoutItem(Map<String, String> map);
}
