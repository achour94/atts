package com.atts.tools.msystem.domain.logging;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Inherited
public @interface InfoLog {
    LogSource source() default LogSource.GENERAL;
    String messageTemplate() default "";
    int[] argsFunction() default {};
}
