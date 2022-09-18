package com.ruoyi.web.controller.system;

import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.system.service.ISysSqlService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
