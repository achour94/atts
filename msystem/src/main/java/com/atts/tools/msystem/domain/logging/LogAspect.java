package com.atts.tools.msystem.domain.logging;

import com.atts.tools.msystem.domain.ports.out.datastore.LogStoragePort;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class LogAspect {

    private final LogStoragePort logStoragePort;

    @Pointcut("@annotation(com.atts.tools.msystem.domain.logging.ErrorLog) && execution(* *(..))")
    public void loggingErrorPointcut() {
    }

    @Pointcut("@annotation(com.atts.tools.msystem.domain.logging.InfoLog) && execution(* *(..))")
    public void loggingInfoPointcut() {
    }

    @AfterReturning("loggingInfoPointcut()")
    public void addInfoLog(JoinPoint joinPoint) {
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        InfoLog logAnnotation = methodSignature.getMethod().getAnnotation(InfoLog.class);
        Object[] methodArgs = joinPoint.getArgs();
        String message = logAnnotation.messageTemplate();
        int[] args = logAnnotation.argsFunction();
        if (args.length > 0) {
            String[] params = new String[args.length];
            for (int i = 0; i < args.length; ++i) {
                params[i] = methodArgs[args[i]].toString();
            }
            message = String.format(message, params);
        }
        Log log = Log.builder().source(logAnnotation.source()).level(SecurityLevel.INFO).message(message)
            .build();
        logStoragePort.save(log);

    }

    @AfterThrowing(value = "loggingErrorPointcut()", throwing = "ex")
    public void addErrorLog(JoinPoint joinPoint, Throwable ex) {
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        ErrorLog logAnnotation = methodSignature.getMethod().getAnnotation(ErrorLog.class);
        Log log = Log.builder().source(logAnnotation.source()).level(SecurityLevel.ERROR).message(ex.getMessage())
            .build();
        logStoragePort.save(log);
    }
}
