package com.ruoyi.web.controller.system;

import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.system.service.ISysSqlService;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/system/sql")
public class SysSqlController {
    @Autowired
    ISysSqlService sysSqlService;

    @ApiOperation(value="执行sql", notes="参数格式示例：{sql_name: 'xxxxx', arg1: 'xxxx' //xxx为sql中的参数名称，sql中的参数要写成 #{xxx}}")
    @PostMapping("/executeSql")
    public AjaxResult executeSql(@RequestBody Map<String, String> map) {
        return AjaxResult.success(sysSqlService.executeSql(map));
    }

    @PostMapping("/getLayout")
    public AjaxResult getLayout(@RequestBody Map<?, ?> map) throws IOException {
        String str = sysSqlService.readLayoutFile(map.get("layout_name").toString());
        if(str.equals("Error")){
            return AjaxResult.error("文件不存在");
        }
        return AjaxResult.success(str);
    }

    @PostMapping("/insertSql")
    public AjaxResult insertSql(@RequestBody Map<String, String> map) {
        map.put("sql_str", StringEscapeUtils.unescapeHtml4(map.get("sql_str")));
        if(sysSqlService.insertSQLStr(map) != 0)
        {
            return AjaxResult.success("插入成功");
        }
        return AjaxResult.error("插入失败");
    }

    @PostMapping("/updateSql")
    public AjaxResult updateSql(@RequestBody Map<String, String> map) {
        map.put("sql_str", StringEscapeUtils.unescapeHtml4(map.get("sql_str")));
        if(sysSqlService.updateSQLStr(map) != 0)
        {
            return AjaxResult.success("插入成功");
        }
        return AjaxResult.error("插入失败");
    }
}
